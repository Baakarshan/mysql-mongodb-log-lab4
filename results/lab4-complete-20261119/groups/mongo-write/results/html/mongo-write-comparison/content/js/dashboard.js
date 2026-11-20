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

    var data = {"OkPercent": 96.73604880021078, "KoPercent": 3.263951199789219};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9673604880021078, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "16 80/s"], "isController": false}, {"data": [1.0, 500, 1500, "02 320/s"], "isController": false}, {"data": [1.0, 500, 1500, "07 2225/s"], "isController": false}, {"data": [1.0, 500, 1500, "18 80/s"], "isController": false}, {"data": [1.0, 500, 1500, "08 2900/s"], "isController": false}, {"data": [0.9965747581989265, 500, 1500, "13 3810/s"], "isController": false}, {"data": [0.9953642384105961, 500, 1500, "17 3775/s"], "isController": false}, {"data": [1.0, 500, 1500, "04 1000/s"], "isController": false}, {"data": [0.9182650392327811, 500, 1500, "11 3900/s"], "isController": false}, {"data": [1.0, 500, 1500, "06 1700/s"], "isController": false}, {"data": [0.9225130208333333, 500, 1500, "15 3840/s"], "isController": false}, {"data": [1.0, 500, 1500, "03 720/s"], "isController": false}, {"data": [0.9584792656728077, 500, 1500, "12 3840/s"], "isController": false}, {"data": [0.9391199359571648, 500, 1500, "14 3810/s"], "isController": false}, {"data": [0.9240124223602485, 500, 1500, "10 4025/s"], "isController": false}, {"data": [1.0, 500, 1500, "09 3775/s"], "isController": false}, {"data": [1.0, 500, 1500, "05 1300/s"], "isController": false}, {"data": [1.0, 500, 1500, "01 80/s"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 823603, 26882, 3.263951199789219, 49.555693701940875, 1, 503, 38.0, 173.0, 202.0, 270.0, 250.72468180060824, 159.98285455572713, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["16 80/s", 1600, 0, 0.0, 3.0831250000000003, 1, 11, 3.0, 4.0, 5.0, 6.0, 80.2769554964628, 46.62202763596909, 0.0], "isController": false}, {"data": ["02 320/s", 6400, 0, 0.0, 2.485624999999999, 1, 12, 2.0, 4.0, 4.0, 5.0, 320.2722313966872, 186.50344980733624, 0.0], "isController": false}, {"data": ["07 2225/s", 44500, 0, 0.0, 2.691730337078666, 1, 17, 3.0, 4.0, 5.0, 9.0, 2224.8887555622223, 1300.48639169604, 0.0], "isController": false}, {"data": ["18 80/s", 1600, 0, 0.0, 3.05375, 1, 10, 3.0, 4.0, 5.0, 6.0, 80.28904054596548, 46.62904620697009, 0.0], "isController": false}, {"data": ["08 2900/s", 58000, 0, 0.0, 3.190137931034488, 1, 27, 3.0, 5.0, 6.0, 10.0, 2899.130260921723, 1694.6421444660352, 0.0], "isController": false}, {"data": ["13 3810/s", 76199, 261, 0.3425241801073505, 18.132810141865694, 1, 282, 5.0, 54.0, 62.0, 164.0, 3806.3339827164195, 2246.4757113554624, 0.0], "isController": false}, {"data": ["17 3775/s", 75500, 350, 0.46357615894039733, 17.267337748344453, 1, 280, 5.0, 50.0, 60.0, 171.0, 3773.1134432783606, 2234.3572354447774, 0.0], "isController": false}, {"data": ["04 1000/s", 20000, 0, 0.0, 2.5728499999999928, 1, 15, 2.0, 4.0, 4.0, 6.0, 1000.3000900270081, 582.9575532816095, 0.0], "isController": false}, {"data": ["11 3900/s", 77996, 6375, 8.173496076721884, 102.34309451766893, 4, 503, 63.0, 215.0, 256.0, 319.0, 3812.6802561470404, 2742.83391114594, 0.0], "isController": false}, {"data": ["06 1700/s", 34000, 0, 0.0, 2.6535294117646933, 1, 16, 3.0, 4.0, 5.0, 8.0, 1700.0, 992.967578125, 0.0], "isController": false}, {"data": ["15 3840/s", 76800, 5951, 7.748697916666667, 98.3036588541669, 3, 501, 62.0, 216.0, 249.0, 306.0, 3796.1544164895454, 2703.0665925745143, 0.0], "isController": false}, {"data": ["03 720/s", 14400, 0, 0.0, 2.4572222222222324, 1, 20, 2.0, 4.0, 4.0, 6.0, 720.2160648194459, 419.67614698472045, 0.0], "isController": false}, {"data": ["12 3840/s", 76805, 3189, 4.152073432719224, 86.46375886986553, 3, 501, 59.0, 200.0, 223.0, 269.0, 3797.152321154892, 2478.642553502126, 0.0], "isController": false}, {"data": ["14 3810/s", 76199, 4639, 6.0880064042835205, 94.87674378928784, 5, 501, 61.0, 205.0, 235.0, 290.0, 3757.7177236413845, 2572.8036060478107, 0.0], "isController": false}, {"data": ["10 4025/s", 80500, 6117, 7.598757763975155, 96.90961490683179, 4, 502, 59.0, 203.0, 230.0, 271.0, 3970.9944751381213, 2817.1389609128355, 0.0], "isController": false}, {"data": ["09 3775/s", 75504, 0, 0.0, 4.651488662852321, 1, 53, 4.0, 8.0, 10.0, 17.0, 3766.3490796627925, 2201.676158683344, 0.0], "isController": false}, {"data": ["05 1300/s", 26000, 0, 0.0, 2.3462307692307647, 1, 13, 2.0, 3.0, 4.0, 7.0, 1300.0, 758.050732421875, 0.0], "isController": false}, {"data": ["01 80/s", 1600, 0, 0.0, 3.3543750000000006, 1, 11, 3.0, 5.0, 5.0, 8.0, 80.29306970442114, 46.63187627026146, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 26824, 99.78424224388067, 3.2569089719197235], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 58, 0.21575775611933637, 0.007042227869495376], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 823603, 26882, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 26824, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 58, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["13 3810/s", 76199, 261, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["17 3775/s", 75500, 350, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 350, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["11 3900/s", 77996, 6375, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 6343, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 32, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["15 3840/s", 76800, 5951, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 5938, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 13, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["12 3840/s", 76805, 3189, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 3188, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["14 3810/s", 76199, 4639, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 4632, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 7, "", "", "", "", "", ""], "isController": false}, {"data": ["10 4025/s", 80500, 6117, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Connect timed out", 6112, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
