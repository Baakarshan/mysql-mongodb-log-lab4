/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 86.30474462181239, "KoPercent": 13.695255378187612};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8630474462181239, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03 720/s"], "isController": false}, {"data": [1.0, 500, 1500, "07 1225/s"], "isController": false}, {"data": [1.0, 500, 1500, "02 320/s"], "isController": false}, {"data": [1.0, 500, 1500, "10 1225/s"], "isController": false}, {"data": [1.0, 500, 1500, "11 80/s"], "isController": false}, {"data": [1.0, 500, 1500, "08 1190/s"], "isController": false}, {"data": [1.0, 500, 1500, "09 1190/s"], "isController": false}, {"data": [0.0, 500, 1500, "05 1300/s"], "isController": false}, {"data": [1.0, 500, 1500, "06 1150/s"], "isController": false}, {"data": [1.0, 500, 1500, "01 80/s"], "isController": false}, {"data": [1.0, 500, 1500, "04 1000/s"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 189562, 25961, 13.695255378187612, 324.37855160845083, 2, 3076, 9.0, 2000.0, 2001.0, 2026.0, 143.28778347717898, 1207.755592944884, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03 720/s", 14400, 0, 0.0, 4.544166666666644, 2, 33, 4.0, 7.0, 8.0, 13.0, 720.07200720072, 6687.995801533278, 0.0], "isController": false}, {"data": ["07 1225/s", 24500, 0, 0.0, 177.03440816326525, 16, 376, 164.0, 279.0, 291.0, 310.0, 1221.8232595252343, 11348.399434906743, 0.0], "isController": false}, {"data": ["02 320/s", 6400, 0, 0.0, 4.338124999999993, 2, 12, 4.0, 6.0, 7.0, 9.0, 320.2081352879372, 2974.028577559789, 0.0], "isController": false}, {"data": ["10 1225/s", 24500, 0, 0.0, 109.0206530612247, 2, 301, 113.0, 218.0, 229.0, 245.0, 1221.8841953019798, 11348.962586809886, 0.0], "isController": false}, {"data": ["11 80/s", 1600, 0, 0.0, 4.448124999999994, 2, 13, 4.0, 6.0, 6.0, 8.0, 80.28501179186111, 745.6727731101662, 0.0], "isController": false}, {"data": ["08 1190/s", 23800, 0, 0.0, 10.541302521008385, 2, 119, 6.0, 19.0, 39.0, 79.0, 1189.3458597771225, 11046.73098741005, 0.0], "isController": false}, {"data": ["09 1190/s", 23800, 0, 0.0, 8.0862605042017, 2, 91, 6.0, 16.0, 20.0, 36.0, 1189.4052973513242, 11047.281632621189, 0.0], "isController": false}, {"data": ["05 1300/s", 25961, 25961, 100.0, 2066.6670775393777, 2000, 3076, 2001.0, 2005.0, 3010.0, 3034.0, 1130.6070899747408, 3408.33645499902, 0.0], "isController": false}, {"data": ["06 1150/s", 23000, 0, 0.0, 7.4870869565217495, 2, 74, 5.0, 15.0, 18.0, 34.0, 1149.1381463902073, 10673.266973597927, 0.0], "isController": false}, {"data": ["01 80/s", 1600, 0, 0.0, 5.173749999999994, 3, 13, 5.0, 7.0, 7.0, 9.0, 80.28098344204716, 745.6353585204466, 0.0], "isController": false}, {"data": ["04 1000/s", 20001, 0, 0.0, 5.230738463076847, 2, 79, 4.0, 9.0, 11.0, 18.0, 999.8500299940011, 9286.637789629573, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 12506, 48.17225838758137, 6.5973138076196705], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 13455, 51.82774161241863, 7.097941570567941], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 189562, 25961, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 13455, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 12506, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["05 1300/s", 25961, 25961, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 13455, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 12506, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
