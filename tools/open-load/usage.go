package main

import (
	"sort"
	"syscall"
)

type syscallUsage struct{ CPU float64 }

func cpuUsage() (float64, int64) {
	var u syscall.Rusage
	if err := syscall.Getrusage(syscall.RUSAGE_SELF, &u); err != nil {
		panic(err)
	}
	return float64(u.Utime.Sec+u.Stime.Sec) + float64(u.Utime.Usec+u.Stime.Usec)/1e6, u.Maxrss
}
func readUsage(u *syscallUsage) { u.CPU, _ = cpuUsage() }
func finishUsage(u syscallUsage, seconds float64) map[string]any {
	cpu, rss := cpuUsage()
	return map[string]any{"cpu_seconds": cpu - u.CPU, "cpu_percent_one_core": 100 * (cpu - u.CPU) / seconds, "max_rss_kib_linux": rss}
}
func summarizeLag(lag []int64) map[string]any {
	sort.Slice(lag, func(i, j int) bool { return lag[i] < lag[j] })
	if len(lag) == 0 {
		return map[string]any{"count": 0}
	}
	return map[string]any{"count": len(lag), "p50": lag[len(lag)/2], "p95": lag[int(float64(len(lag)-1)*.95)], "p99": lag[int(float64(len(lag)-1)*.99)], "max": lag[len(lag)-1]}
}
