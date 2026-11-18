// open-load 按固定时间间隔启动 HTTP 请求，并导出 JMeter 可读的 JTL。
package main

import (
	"bytes"
	"compress/gzip"
	"encoding/csv"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/httptrace"
	"os"
	"path/filepath"
	"strconv"
	"sync"
	"sync/atomic"
	"time"
)

type second struct {
	Scheduled int64 `json:"scheduled"`
	Started   int64 `json:"started"`
	OnWire    int64 `json:"on_wire"`
	Completed int64 `json:"completed"`
	Dropped   int64 `json:"dropped"`
}

type result struct{ row []string }

func main() {
	base := flag.String("url", "http://172.31.12.145:18080", "应用地址")
	operation := flag.String("operation", "read", "read 或 write")
	rate := flag.Int("rate", 80, "每秒计划请求数")
	seconds := flag.Int("seconds", 35, "发起请求的持续秒数")
	limit := flag.Int("max-inflight", 12000, "同时在途请求上限，达到时记录丢弃")
	output := flag.String("output", "run", "结果目录")
	flag.Parse()
	if *rate <= 0 || *seconds <= 0 || *limit <= 0 || (*operation != "read" && *operation != "write") {
		panic("参数无效")
	}
	if err := os.MkdirAll(*output, 0755); err != nil {
		panic(err)
	}
	// 创建新文件，防止覆盖已经完成的原始测量。
	f, err := os.OpenFile(filepath.Join(*output, "all.jtl.gz"), os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}
	gz := gzip.NewWriter(f)
	writer := csv.NewWriter(gz)
	check := func(err error) {
		if err != nil {
			panic(err)
		}
	}
	check(writer.Write([]string{"timeStamp", "elapsed", "label", "responseCode", "responseMessage", "threadName", "dataType", "success", "failureMessage", "bytes", "sentBytes", "grpThreads", "allThreads", "URL", "Latency", "IdleTime", "Connect", "scheduledTime", "dispatchLagMicros"}))
	records := make(chan result, 4096)
	writeDone := make(chan struct{})
	go func() {
		defer close(writeDone)
		for r := range records {
			check(writer.Write(r.row))
		}
		writer.Flush()
		check(writer.Error())
		check(gz.Close())
		check(f.Close())
	}()
	transport := &http.Transport{
		Proxy: nil, DialContext: (&net.Dialer{Timeout: 2 * time.Second, KeepAlive: 30 * time.Second}).DialContext,
		MaxIdleConns: *limit, MaxIdleConnsPerHost: *limit, IdleConnTimeout: 30 * time.Second,
		DisableCompression: true, ForceAttemptHTTP2: false,
	}
	client := &http.Client{Transport: transport, Timeout: 5 * time.Second, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
	bins := make([]second, *seconds+7)
	start := time.Now().Add(250 * time.Millisecond)
	check(os.WriteFile(filepath.Join(*output, "start-ms.txt"), []byte(strconv.FormatInt(start.UnixMilli(), 10)), 0644))
	var inflight atomic.Int64
	var maximum atomic.Int64
	var wg sync.WaitGroup
	var mu sync.Mutex
	var process syscallUsage
	readUsage(&process)
	update := func(t time.Time, field string) {
		i := int(t.Sub(start) / time.Second)
		if i < 0 || i >= len(bins) {
			return
		}
		mu.Lock()
		defer mu.Unlock()
		switch field {
		case "scheduled":
			bins[i].Scheduled++
		case "started":
			bins[i].Started++
		case "wire":
			bins[i].OnWire++
		case "completed":
			bins[i].Completed++
		case "dropped":
			bins[i].Dropped++
		}
	}
	lag := make([]int64, 0, *rate**seconds)
	// 所有到达时刻由序号决定，与前一个请求的完成时刻无关。
	for sequence := 0; sequence < *rate**seconds; sequence++ {
		planned := start.Add(time.Duration(int64(sequence) * int64(time.Second) / int64(*rate)))
		if wait := time.Until(planned); wait > 0 {
			time.Sleep(wait)
		}
		now := time.Now()
		update(planned, "scheduled")
		// 超过100毫秒的调度欠账不集中补发，保留漏发数量。
		if now.Sub(planned) > 100*time.Millisecond || inflight.Load() >= int64(*limit) {
			update(planned, "dropped")
			continue
		}
		active := inflight.Add(1)
		for old := maximum.Load(); active > old; old = maximum.Load() {
			if maximum.CompareAndSwap(old, active) {
				break
			}
		}
		wg.Add(1)
		go func(seq int, planned time.Time, active int64) {
			defer wg.Done()
			defer inflight.Add(-1)
			method, path := "GET", "/api/logs?level=INFO&from=2026-11-01T06%3A00%3A00Z&to=2026-11-01T07%3A00%3A00Z&page=0&size=20"
			var payload []byte
			if *operation == "write" {
				method, path = "POST", "/api/logs"
				payload = []byte(fmt.Sprintf(`{"traceId":"open-%d-%d","level":"INFO","source":"course-service-0","message":"%s","clientIp":"10.0.0.1","createdAt":"2026-11-02T00:00:00.000Z"}`, start.UnixMilli(), seq, bytes.Repeat([]byte("course benchmark payload. "), 10)))
			}
			req, err := http.NewRequest(method, *base+path, bytes.NewReader(payload))
			if err != nil {
				panic(err)
			}
			req.Header.Set("Content-Type", "application/json")
			var firstByte, connected time.Time
			var connectStart time.Time
			trace := &httptrace.ClientTrace{
				ConnectStart:         func(_, _ string) { connectStart = time.Now() },
				ConnectDone:          func(_, _ string, _ error) { connected = time.Now() },
				GotFirstResponseByte: func() { firstByte = time.Now() },
				WroteRequest: func(info httptrace.WroteRequestInfo) {
					if info.Err == nil {
						update(time.Now(), "wire")
					}
				},
			}
			req = req.WithContext(httptrace.WithClientTrace(req.Context(), trace))
			launched := time.Now()
			update(launched, "started")
			mu.Lock()
			lag = append(lag, launched.Sub(planned).Microseconds())
			mu.Unlock()
			response, requestError := client.Do(req)
			code, message, success := "Non HTTP response code: transport error", "", "false"
			var count int64
			if requestError != nil {
				message = requestError.Error()
			} else {
				body, bodyError := io.ReadAll(response.Body)
				response.Body.Close()
				count = int64(len(body))
				code = strconv.Itoa(response.StatusCode)
				message = response.Status
				expected, shape := 200, []byte(`"totalElements":`)
				if *operation == "write" {
					expected, shape = 201, []byte(`"id":`)
				}
				if bodyError == nil && response.StatusCode == expected && bytes.Contains(body, shape) {
					success = "true"
				} else if bodyError != nil {
					message = bodyError.Error()
				}
			}
			done := time.Now()
			update(done, "completed")
			latency, connect := int64(0), int64(0)
			if !firstByte.IsZero() {
				latency = firstByte.Sub(launched).Milliseconds()
			}
			if !connectStart.IsZero() && !connected.IsZero() {
				connect = connected.Sub(connectStart).Milliseconds()
			}
			failure := ""
			if success != "true" {
				failure = message
			}
			records <- result{[]string{strconv.FormatInt(launched.UnixMilli(), 10), strconv.FormatInt(done.Sub(launched).Milliseconds(), 10), *operation, code, message, "arrival-" + strconv.Itoa(seq), "text", success, failure, strconv.FormatInt(count, 10), strconv.Itoa(len(payload)), strconv.FormatInt(active, 10), strconv.FormatInt(active, 10), *base + path, strconv.FormatInt(latency, 10), "0", strconv.FormatInt(connect, 10), strconv.FormatInt(planned.UnixMilli(), 10), strconv.FormatInt(launched.Sub(planned).Microseconds(), 10)}}
		}(sequence, planned, active)
	}
	wg.Wait()
	close(records)
	<-writeDone
	transport.CloseIdleConnections()
	end := time.Now()
	report := map[string]any{"model": "open-fixed-interval", "rate": *rate, "seconds": *seconds, "max_inflight_limit": *limit, "max_inflight_observed": maximum.Load(), "start_ms": start.UnixMilli(), "end_ms": end.UnixMilli(), "per_second": bins, "dispatch_lag_microseconds": summarizeLag(lag), "process": finishUsage(process, end.Sub(start).Seconds())}
	b, err := json.MarshalIndent(report, "", "  ")
	check(err)
	check(os.WriteFile(filepath.Join(*output, "arrivals.json"), append(b, '\n'), 0644))
	fmt.Println(string(b))
}
