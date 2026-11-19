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

    var data = {"OkPercent": 96.71454739163754, "KoPercent": 3.2854526083624607};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7992724435057289, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03596153846153846, 500, 1500, "07 1300/s"], "isController": false}, {"data": [1.0, 500, 1500, "03 720/s"], "isController": false}, {"data": [1.0, 500, 1500, "02 320/s"], "isController": false}, {"data": [0.9999795918367347, 500, 1500, "11 1225/s"], "isController": false}, {"data": [0.7814400587779093, 500, 1500, "09 1225/s"], "isController": false}, {"data": [1.0, 500, 1500, "10 1200/s"], "isController": false}, {"data": [1.0, 500, 1500, "12 80/s"], "isController": false}, {"data": [0.49854, 500, 1500, "08 1250/s"], "isController": false}, {"data": [1.0, 500, 1500, "01 80/s"], "isController": false}, {"data": [1.0, 500, 1500, "04 1000/s"], "isController": false}, {"data": [1.0, 500, 1500, "05 1100/s"], "isController": false}, {"data": [1.0, 500, 1500, "06 1200/s"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 214004, 7031, 3.2854526083624607, 372.8633670398683, 2, 3055, 14.0, 1568.0, 1846.0, 2002.0, 162.8671386681218, 1479.380123304149, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["07 1300/s", 26000, 7031, 27.04230769230769, 1793.8568076923043, 16, 3055, 1802.0, 2001.0, 2005.0, 2916.8699999999735, 1181.9793608219302, 8986.8149634041, 0.0], "isController": false}, {"data": ["03 720/s", 14400, 0, 0.0, 5.28875000000001, 2, 31, 5.0, 8.0, 9.0, 13.0, 719.9640017999101, 6687.025219051547, 0.0], "isController": false}, {"data": ["02 320/s", 6400, 0, 0.0, 5.05359375000001, 2, 15, 5.0, 7.0, 9.0, 11.0, 320.2241569098369, 2974.184468190233, 0.0], "isController": false}, {"data": ["11 1225/s", 24500, 0, 0.0, 75.96995918367253, 2, 1120, 46.0, 191.0, 217.0, 263.0, 1224.0207833733014, 11368.80739548986, 0.0], "isController": false}, {"data": ["09 1225/s", 24499, 0, 0.0, 389.10780031837635, 2, 1777, 433.0, 650.0, 671.0, 722.0, 1223.604035560883, 11364.93943576129, 0.0], "isController": false}, {"data": ["10 1200/s", 24000, 0, 0.0, 11.129499999999936, 2, 167, 8.0, 22.0, 28.0, 44.0, 1199.400299850075, 11140.125981930909, 0.0], "isController": false}, {"data": ["12 80/s", 1600, 0, 0.0, 5.209999999999996, 3, 17, 5.0, 6.0, 7.0, 11.0, 80.26487408447879, 745.4857377000351, 0.0], "isController": false}, {"data": ["08 1250/s", 25000, 0, 0.0, 829.9761199999981, 11, 2091, 820.0, 954.0, 991.0, 1051.0, 1204.7612163269239, 11189.925711411497, 0.0], "isController": false}, {"data": ["01 80/s", 1600, 0, 0.0, 6.328750000000004, 3, 14, 6.0, 8.0, 9.0, 11.0, 80.26890081773942, 745.5231372754979, 0.0], "isController": false}, {"data": ["04 1000/s", 20000, 0, 0.0, 6.848100000000005, 2, 42, 6.0, 12.0, 15.0, 21.0, 999.4003597841296, 9282.469727148085, 0.0], "isController": false}, {"data": ["05 1100/s", 22005, 0, 0.0, 10.797182458532145, 2, 279, 6.0, 17.0, 31.0, 106.0, 1099.6451951426716, 10213.565107550223, 0.0], "isController": false}, {"data": ["06 1200/s", 24000, 0, 0.0, 10.080458333333315, 2, 204, 7.0, 19.0, 27.0, 49.0, 1198.2625193469469, 11129.552529691322, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 3204, 45.56962025316456, 1.4971682772284631], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3827, 54.43037974683544, 1.7882843311339975], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 214004, 7031, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3827, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 3204, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["07 1300/s", 26000, 7031, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3827, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 3204, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
