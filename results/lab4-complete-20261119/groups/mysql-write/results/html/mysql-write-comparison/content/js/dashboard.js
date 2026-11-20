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

    var data = {"OkPercent": 94.15173915852229, "KoPercent": 5.848260841477708};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9415028892589179, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9923737373737374, 500, 1500, "14 3960/s"], "isController": false}, {"data": [1.0, 500, 1500, "16 80/s"], "isController": false}, {"data": [1.0, 500, 1500, "02 320/s"], "isController": false}, {"data": [1.0, 500, 1500, "07 2225/s"], "isController": false}, {"data": [1.0, 500, 1500, "08 2900/s"], "isController": false}, {"data": [1.0, 500, 1500, "04 1000/s"], "isController": false}, {"data": [0.9968075695219046, 500, 1500, "11 3900/s"], "isController": false}, {"data": [1.0, 500, 1500, "06 1700/s"], "isController": false}, {"data": [1.0, 500, 1500, "03 720/s"], "isController": false}, {"data": [0.5041242236024844, 500, 1500, "10 4025/s"], "isController": false}, {"data": [1.0, 500, 1500, "09 3775/s"], "isController": false}, {"data": [1.0, 500, 1500, "05 1300/s"], "isController": false}, {"data": [0.9972348833979369, 500, 1500, "12 3960/s"], "isController": false}, {"data": [1.0, 500, 1500, "01 80/s"], "isController": false}, {"data": [0.9711525207082795, 500, 1500, "13 3990/s"], "isController": false}, {"data": [0.9864915666274028, 500, 1500, "15 3990/s"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 758499, 44359, 5.848260841477708, 35.8017439706588, 0, 519, 6.0, 107.0, 200.0, 255.0, 135.27852878119145, 93.38013351259322, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["14 3960/s", 79200, 604, 0.7626262626262627, 27.70792929292955, 1, 368, 20.0, 54.0, 70.0, 194.0, 3944.812471982866, 2355.4226384669023, 0.0], "isController": false}, {"data": ["16 80/s", 1600, 0, 0.0, 2.7606250000000028, 1, 7, 3.0, 3.0, 4.0, 5.0, 80.29709926728897, 46.63372642841012, 0.0], "isController": false}, {"data": ["02 320/s", 6400, 0, 0.0, 2.4498437499999968, 1, 20, 2.0, 3.0, 4.0, 5.989999999999782, 320.28825943349017, 186.51561796241617, 0.0], "isController": false}, {"data": ["07 2225/s", 44500, 0, 0.0, 3.1251235955056447, 1, 67, 2.0, 4.0, 7.0, 28.0, 2225.0, 1300.5953125, 0.0], "isController": false}, {"data": ["08 2900/s", 58000, 0, 0.0, 4.4247758620689055, 1, 150, 2.0, 7.0, 17.0, 43.0, 2897.8266300274795, 1693.9197457375717, 0.0], "isController": false}, {"data": ["04 1000/s", 20000, 0, 0.0, 2.3254000000000046, 1, 25, 2.0, 3.0, 4.0, 7.0, 1000.100010001, 582.866440940969, 0.0], "isController": false}, {"data": ["11 3900/s", 77997, 249, 0.3192430478095311, 7.656307293870305, 1, 216, 3.0, 18.0, 26.0, 51.0, 3894.592300394467, 2297.056932126005, 0.0], "isController": false}, {"data": ["06 1700/s", 34000, 0, 0.0, 2.6711176470588094, 1, 79, 2.0, 3.0, 4.0, 16.0, 1700.0, 992.957958984375, 0.0], "isController": false}, {"data": ["03 720/s", 14400, 0, 0.0, 2.323055555555556, 1, 21, 2.0, 3.0, 4.0, 9.0, 720.2520882308809, 419.70143651840647, 0.0], "isController": false}, {"data": ["10 4025/s", 80500, 39907, 49.573913043478264, 175.26659627329278, 0, 519, 200.0, 201.0, 500.0, 501.0, 3930.28024606972, 5861.6830955991845, 0.0], "isController": false}, {"data": ["09 3775/s", 75500, 0, 0.0, 5.2593642384106225, 1, 142, 3.0, 12.0, 19.0, 42.0, 3771.0404075720494, 2204.390175472004, 0.0], "isController": false}, {"data": ["05 1300/s", 26000, 0, 0.0, 2.353884615384611, 1, 62, 2.0, 3.0, 4.0, 9.0, 1300.0650032501626, 758.0179790239513, 0.0], "isController": false}, {"data": ["12 3960/s", 79201, 219, 0.2765116602063105, 10.817590686986271, 1, 254, 4.0, 26.0, 38.0, 84.0, 3950.7657006035815, 2327.4277128435674, 0.0], "isController": false}, {"data": ["01 80/s", 1600, 0, 0.0, 2.8087499999999963, 1, 15, 3.0, 3.0, 4.0, 6.0, 80.2769554964628, 46.62202763596909, 0.0], "isController": false}, {"data": ["13 3990/s", 79799, 2302, 2.8847479291720446, 61.67835436534301, 1, 501, 49.0, 140.0, 200.0, 313.0, 3972.0756595321054, 2511.0070600267545, 0.0], "isController": false}, {"data": ["15 3990/s", 79802, 1078, 1.3508433372597177, 42.943760807999965, 1, 450, 36.0, 75.0, 141.0, 220.97000000000116, 3984.720627153343, 2417.726840250037, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, 0.022543339570323947, 0.0013183933004526044], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 40203, 90.63098807457337, 5.300336585809606], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4146, 9.346468585856309, 0.5466058623676497], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 758499, 44359, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 40203, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4146, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["14 3960/s", 79200, 604, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 604, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["11 3900/s", 77997, 249, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 249, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["10 4025/s", 80500, 39907, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 35763, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4134, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["12 3960/s", 79201, 219, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 219, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["13 3990/s", 79799, 2302, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 2290, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["15 3990/s", 79802, 1078, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 1078, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
