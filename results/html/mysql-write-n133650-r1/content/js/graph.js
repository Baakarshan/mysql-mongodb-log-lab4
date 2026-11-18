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
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 35.0, "series": [{"data": [[0.0, 1.0], [0.1, 1.0], [0.2, 1.0], [0.3, 1.0], [0.4, 1.0], [0.5, 1.0], [0.6, 1.0], [0.7, 1.0], [0.8, 1.0], [0.9, 1.0], [1.0, 1.0], [1.1, 1.0], [1.2, 1.0], [1.3, 1.0], [1.4, 1.0], [1.5, 1.0], [1.6, 1.0], [1.7, 1.0], [1.8, 1.0], [1.9, 1.0], [2.0, 1.0], [2.1, 1.0], [2.2, 1.0], [2.3, 1.0], [2.4, 1.0], [2.5, 1.0], [2.6, 1.0], [2.7, 1.0], [2.8, 1.0], [2.9, 1.0], [3.0, 1.0], [3.1, 1.0], [3.2, 1.0], [3.3, 1.0], [3.4, 1.0], [3.5, 1.0], [3.6, 1.0], [3.7, 1.0], [3.8, 1.0], [3.9, 1.0], [4.0, 2.0], [4.1, 2.0], [4.2, 2.0], [4.3, 2.0], [4.4, 2.0], [4.5, 2.0], [4.6, 2.0], [4.7, 2.0], [4.8, 2.0], [4.9, 2.0], [5.0, 2.0], [5.1, 2.0], [5.2, 2.0], [5.3, 2.0], [5.4, 2.0], [5.5, 2.0], [5.6, 2.0], [5.7, 2.0], [5.8, 2.0], [5.9, 2.0], [6.0, 2.0], [6.1, 2.0], [6.2, 2.0], [6.3, 2.0], [6.4, 2.0], [6.5, 2.0], [6.6, 2.0], [6.7, 2.0], [6.8, 2.0], [6.9, 2.0], [7.0, 2.0], [7.1, 2.0], [7.2, 2.0], [7.3, 2.0], [7.4, 2.0], [7.5, 2.0], [7.6, 2.0], [7.7, 2.0], [7.8, 2.0], [7.9, 2.0], [8.0, 2.0], [8.1, 2.0], [8.2, 2.0], [8.3, 2.0], [8.4, 2.0], [8.5, 2.0], [8.6, 2.0], [8.7, 2.0], [8.8, 2.0], [8.9, 2.0], [9.0, 2.0], [9.1, 2.0], [9.2, 2.0], [9.3, 2.0], [9.4, 2.0], [9.5, 2.0], [9.6, 2.0], [9.7, 2.0], [9.8, 2.0], [9.9, 2.0], [10.0, 2.0], [10.1, 2.0], [10.2, 2.0], [10.3, 2.0], [10.4, 2.0], [10.5, 2.0], [10.6, 2.0], [10.7, 2.0], [10.8, 2.0], [10.9, 2.0], [11.0, 2.0], [11.1, 2.0], [11.2, 2.0], [11.3, 2.0], [11.4, 2.0], [11.5, 2.0], [11.6, 2.0], [11.7, 2.0], [11.8, 2.0], [11.9, 2.0], [12.0, 2.0], [12.1, 2.0], [12.2, 2.0], [12.3, 2.0], [12.4, 2.0], [12.5, 2.0], [12.6, 2.0], [12.7, 2.0], [12.8, 2.0], [12.9, 2.0], [13.0, 2.0], [13.1, 2.0], [13.2, 2.0], [13.3, 2.0], [13.4, 2.0], [13.5, 2.0], [13.6, 2.0], [13.7, 2.0], [13.8, 2.0], [13.9, 2.0], [14.0, 2.0], [14.1, 2.0], [14.2, 2.0], [14.3, 2.0], [14.4, 2.0], [14.5, 2.0], [14.6, 2.0], [14.7, 2.0], [14.8, 2.0], [14.9, 2.0], [15.0, 2.0], [15.1, 2.0], [15.2, 2.0], [15.3, 2.0], [15.4, 2.0], [15.5, 2.0], [15.6, 2.0], [15.7, 2.0], [15.8, 2.0], [15.9, 2.0], [16.0, 2.0], [16.1, 2.0], [16.2, 2.0], [16.3, 2.0], [16.4, 2.0], [16.5, 2.0], [16.6, 2.0], [16.7, 2.0], [16.8, 2.0], [16.9, 2.0], [17.0, 2.0], [17.1, 2.0], [17.2, 2.0], [17.3, 2.0], [17.4, 2.0], [17.5, 2.0], [17.6, 2.0], [17.7, 2.0], [17.8, 2.0], [17.9, 2.0], [18.0, 2.0], [18.1, 2.0], [18.2, 2.0], [18.3, 2.0], [18.4, 2.0], [18.5, 2.0], [18.6, 2.0], [18.7, 2.0], [18.8, 2.0], [18.9, 2.0], [19.0, 2.0], [19.1, 2.0], [19.2, 2.0], [19.3, 2.0], [19.4, 2.0], [19.5, 2.0], [19.6, 2.0], [19.7, 2.0], [19.8, 2.0], [19.9, 2.0], [20.0, 2.0], [20.1, 2.0], [20.2, 2.0], [20.3, 2.0], [20.4, 2.0], [20.5, 2.0], [20.6, 2.0], [20.7, 2.0], [20.8, 2.0], [20.9, 2.0], [21.0, 2.0], [21.1, 2.0], [21.2, 2.0], [21.3, 2.0], [21.4, 2.0], [21.5, 2.0], [21.6, 2.0], [21.7, 2.0], [21.8, 2.0], [21.9, 2.0], [22.0, 2.0], [22.1, 2.0], [22.2, 2.0], [22.3, 2.0], [22.4, 2.0], [22.5, 2.0], [22.6, 2.0], [22.7, 2.0], [22.8, 2.0], [22.9, 2.0], [23.0, 2.0], [23.1, 2.0], [23.2, 2.0], [23.3, 2.0], [23.4, 2.0], [23.5, 2.0], [23.6, 2.0], [23.7, 2.0], [23.8, 2.0], [23.9, 2.0], [24.0, 2.0], [24.1, 2.0], [24.2, 2.0], [24.3, 2.0], [24.4, 2.0], [24.5, 2.0], [24.6, 2.0], [24.7, 2.0], [24.8, 2.0], [24.9, 2.0], [25.0, 2.0], [25.1, 2.0], [25.2, 2.0], [25.3, 2.0], [25.4, 2.0], [25.5, 2.0], [25.6, 2.0], [25.7, 2.0], [25.8, 2.0], [25.9, 2.0], [26.0, 2.0], [26.1, 2.0], [26.2, 2.0], [26.3, 2.0], [26.4, 2.0], [26.5, 2.0], [26.6, 2.0], [26.7, 2.0], [26.8, 2.0], [26.9, 2.0], [27.0, 2.0], [27.1, 2.0], [27.2, 2.0], [27.3, 2.0], [27.4, 2.0], [27.5, 2.0], [27.6, 2.0], [27.7, 2.0], [27.8, 2.0], [27.9, 2.0], [28.0, 2.0], [28.1, 2.0], [28.2, 2.0], [28.3, 2.0], [28.4, 2.0], [28.5, 2.0], [28.6, 2.0], [28.7, 2.0], [28.8, 2.0], [28.9, 2.0], [29.0, 2.0], [29.1, 2.0], [29.2, 2.0], [29.3, 2.0], [29.4, 2.0], [29.5, 2.0], [29.6, 2.0], [29.7, 2.0], [29.8, 2.0], [29.9, 2.0], [30.0, 2.0], [30.1, 2.0], [30.2, 2.0], [30.3, 2.0], [30.4, 2.0], [30.5, 2.0], [30.6, 2.0], [30.7, 2.0], [30.8, 2.0], [30.9, 2.0], [31.0, 2.0], [31.1, 2.0], [31.2, 2.0], [31.3, 2.0], [31.4, 2.0], [31.5, 2.0], [31.6, 2.0], [31.7, 2.0], [31.8, 2.0], [31.9, 2.0], [32.0, 2.0], [32.1, 2.0], [32.2, 2.0], [32.3, 2.0], [32.4, 2.0], [32.5, 2.0], [32.6, 2.0], [32.7, 2.0], [32.8, 2.0], [32.9, 2.0], [33.0, 2.0], [33.1, 2.0], [33.2, 2.0], [33.3, 2.0], [33.4, 2.0], [33.5, 2.0], [33.6, 2.0], [33.7, 2.0], [33.8, 2.0], [33.9, 2.0], [34.0, 2.0], [34.1, 2.0], [34.2, 2.0], [34.3, 2.0], [34.4, 2.0], [34.5, 2.0], [34.6, 2.0], [34.7, 2.0], [34.8, 2.0], [34.9, 2.0], [35.0, 2.0], [35.1, 2.0], [35.2, 2.0], [35.3, 2.0], [35.4, 2.0], [35.5, 2.0], [35.6, 2.0], [35.7, 2.0], [35.8, 2.0], [35.9, 2.0], [36.0, 2.0], [36.1, 2.0], [36.2, 2.0], [36.3, 2.0], [36.4, 2.0], [36.5, 2.0], [36.6, 2.0], [36.7, 2.0], [36.8, 2.0], [36.9, 2.0], [37.0, 2.0], [37.1, 2.0], [37.2, 2.0], [37.3, 2.0], [37.4, 2.0], [37.5, 2.0], [37.6, 2.0], [37.7, 2.0], [37.8, 2.0], [37.9, 2.0], [38.0, 2.0], [38.1, 2.0], [38.2, 2.0], [38.3, 2.0], [38.4, 2.0], [38.5, 2.0], [38.6, 2.0], [38.7, 2.0], [38.8, 2.0], [38.9, 2.0], [39.0, 2.0], [39.1, 2.0], [39.2, 2.0], [39.3, 2.0], [39.4, 2.0], [39.5, 2.0], [39.6, 2.0], [39.7, 2.0], [39.8, 2.0], [39.9, 2.0], [40.0, 2.0], [40.1, 2.0], [40.2, 2.0], [40.3, 2.0], [40.4, 2.0], [40.5, 2.0], [40.6, 2.0], [40.7, 2.0], [40.8, 2.0], [40.9, 2.0], [41.0, 2.0], [41.1, 2.0], [41.2, 2.0], [41.3, 2.0], [41.4, 2.0], [41.5, 2.0], [41.6, 2.0], [41.7, 2.0], [41.8, 2.0], [41.9, 2.0], [42.0, 2.0], [42.1, 2.0], [42.2, 2.0], [42.3, 2.0], [42.4, 2.0], [42.5, 2.0], [42.6, 2.0], [42.7, 2.0], [42.8, 2.0], [42.9, 2.0], [43.0, 2.0], [43.1, 2.0], [43.2, 2.0], [43.3, 2.0], [43.4, 2.0], [43.5, 2.0], [43.6, 2.0], [43.7, 2.0], [43.8, 2.0], [43.9, 2.0], [44.0, 2.0], [44.1, 2.0], [44.2, 2.0], [44.3, 2.0], [44.4, 2.0], [44.5, 2.0], [44.6, 2.0], [44.7, 2.0], [44.8, 2.0], [44.9, 2.0], [45.0, 3.0], [45.1, 3.0], [45.2, 3.0], [45.3, 3.0], [45.4, 3.0], [45.5, 3.0], [45.6, 3.0], [45.7, 3.0], [45.8, 3.0], [45.9, 3.0], [46.0, 3.0], [46.1, 3.0], [46.2, 3.0], [46.3, 3.0], [46.4, 3.0], [46.5, 3.0], [46.6, 3.0], [46.7, 3.0], [46.8, 3.0], [46.9, 3.0], [47.0, 3.0], [47.1, 3.0], [47.2, 3.0], [47.3, 3.0], [47.4, 3.0], [47.5, 3.0], [47.6, 3.0], [47.7, 3.0], [47.8, 3.0], [47.9, 3.0], [48.0, 3.0], [48.1, 3.0], [48.2, 3.0], [48.3, 3.0], [48.4, 3.0], [48.5, 3.0], [48.6, 3.0], [48.7, 3.0], [48.8, 3.0], [48.9, 3.0], [49.0, 3.0], [49.1, 3.0], [49.2, 3.0], [49.3, 3.0], [49.4, 3.0], [49.5, 3.0], [49.6, 3.0], [49.7, 3.0], [49.8, 3.0], [49.9, 3.0], [50.0, 3.0], [50.1, 3.0], [50.2, 3.0], [50.3, 3.0], [50.4, 3.0], [50.5, 3.0], [50.6, 3.0], [50.7, 3.0], [50.8, 3.0], [50.9, 3.0], [51.0, 3.0], [51.1, 3.0], [51.2, 3.0], [51.3, 3.0], [51.4, 3.0], [51.5, 3.0], [51.6, 3.0], [51.7, 3.0], [51.8, 3.0], [51.9, 3.0], [52.0, 3.0], [52.1, 3.0], [52.2, 3.0], [52.3, 3.0], [52.4, 3.0], [52.5, 3.0], [52.6, 3.0], [52.7, 3.0], [52.8, 3.0], [52.9, 3.0], [53.0, 3.0], [53.1, 3.0], [53.2, 3.0], [53.3, 3.0], [53.4, 3.0], [53.5, 3.0], [53.6, 3.0], [53.7, 3.0], [53.8, 3.0], [53.9, 3.0], [54.0, 3.0], [54.1, 3.0], [54.2, 3.0], [54.3, 3.0], [54.4, 3.0], [54.5, 3.0], [54.6, 3.0], [54.7, 3.0], [54.8, 3.0], [54.9, 3.0], [55.0, 3.0], [55.1, 3.0], [55.2, 3.0], [55.3, 3.0], [55.4, 3.0], [55.5, 3.0], [55.6, 3.0], [55.7, 3.0], [55.8, 3.0], [55.9, 3.0], [56.0, 3.0], [56.1, 3.0], [56.2, 3.0], [56.3, 3.0], [56.4, 3.0], [56.5, 3.0], [56.6, 3.0], [56.7, 3.0], [56.8, 3.0], [56.9, 3.0], [57.0, 3.0], [57.1, 3.0], [57.2, 3.0], [57.3, 3.0], [57.4, 3.0], [57.5, 3.0], [57.6, 3.0], [57.7, 3.0], [57.8, 3.0], [57.9, 3.0], [58.0, 3.0], [58.1, 3.0], [58.2, 3.0], [58.3, 3.0], [58.4, 3.0], [58.5, 3.0], [58.6, 3.0], [58.7, 3.0], [58.8, 3.0], [58.9, 3.0], [59.0, 3.0], [59.1, 3.0], [59.2, 3.0], [59.3, 3.0], [59.4, 3.0], [59.5, 3.0], [59.6, 3.0], [59.7, 3.0], [59.8, 3.0], [59.9, 3.0], [60.0, 3.0], [60.1, 3.0], [60.2, 3.0], [60.3, 3.0], [60.4, 3.0], [60.5, 3.0], [60.6, 3.0], [60.7, 3.0], [60.8, 3.0], [60.9, 3.0], [61.0, 3.0], [61.1, 3.0], [61.2, 3.0], [61.3, 3.0], [61.4, 3.0], [61.5, 3.0], [61.6, 3.0], [61.7, 3.0], [61.8, 3.0], [61.9, 3.0], [62.0, 3.0], [62.1, 3.0], [62.2, 3.0], [62.3, 3.0], [62.4, 3.0], [62.5, 3.0], [62.6, 3.0], [62.7, 3.0], [62.8, 3.0], [62.9, 3.0], [63.0, 3.0], [63.1, 3.0], [63.2, 3.0], [63.3, 3.0], [63.4, 3.0], [63.5, 3.0], [63.6, 3.0], [63.7, 3.0], [63.8, 3.0], [63.9, 3.0], [64.0, 3.0], [64.1, 3.0], [64.2, 3.0], [64.3, 3.0], [64.4, 3.0], [64.5, 3.0], [64.6, 3.0], [64.7, 3.0], [64.8, 3.0], [64.9, 3.0], [65.0, 3.0], [65.1, 3.0], [65.2, 3.0], [65.3, 3.0], [65.4, 3.0], [65.5, 3.0], [65.6, 3.0], [65.7, 3.0], [65.8, 3.0], [65.9, 3.0], [66.0, 3.0], [66.1, 3.0], [66.2, 3.0], [66.3, 3.0], [66.4, 3.0], [66.5, 3.0], [66.6, 3.0], [66.7, 3.0], [66.8, 3.0], [66.9, 3.0], [67.0, 3.0], [67.1, 3.0], [67.2, 3.0], [67.3, 3.0], [67.4, 3.0], [67.5, 3.0], [67.6, 3.0], [67.7, 3.0], [67.8, 3.0], [67.9, 3.0], [68.0, 3.0], [68.1, 3.0], [68.2, 3.0], [68.3, 3.0], [68.4, 3.0], [68.5, 3.0], [68.6, 3.0], [68.7, 3.0], [68.8, 3.0], [68.9, 3.0], [69.0, 3.0], [69.1, 3.0], [69.2, 3.0], [69.3, 3.0], [69.4, 3.0], [69.5, 3.0], [69.6, 3.0], [69.7, 3.0], [69.8, 3.0], [69.9, 3.0], [70.0, 3.0], [70.1, 3.0], [70.2, 3.0], [70.3, 3.0], [70.4, 3.0], [70.5, 3.0], [70.6, 3.0], [70.7, 3.0], [70.8, 3.0], [70.9, 3.0], [71.0, 3.0], [71.1, 3.0], [71.2, 3.0], [71.3, 3.0], [71.4, 3.0], [71.5, 3.0], [71.6, 3.0], [71.7, 3.0], [71.8, 3.0], [71.9, 3.0], [72.0, 3.0], [72.1, 3.0], [72.2, 3.0], [72.3, 3.0], [72.4, 3.0], [72.5, 3.0], [72.6, 3.0], [72.7, 3.0], [72.8, 3.0], [72.9, 3.0], [73.0, 3.0], [73.1, 3.0], [73.2, 3.0], [73.3, 3.0], [73.4, 3.0], [73.5, 3.0], [73.6, 3.0], [73.7, 3.0], [73.8, 3.0], [73.9, 3.0], [74.0, 3.0], [74.1, 3.0], [74.2, 3.0], [74.3, 3.0], [74.4, 3.0], [74.5, 3.0], [74.6, 3.0], [74.7, 3.0], [74.8, 3.0], [74.9, 3.0], [75.0, 3.0], [75.1, 3.0], [75.2, 3.0], [75.3, 3.0], [75.4, 3.0], [75.5, 3.0], [75.6, 3.0], [75.7, 3.0], [75.8, 3.0], [75.9, 3.0], [76.0, 3.0], [76.1, 3.0], [76.2, 3.0], [76.3, 3.0], [76.4, 3.0], [76.5, 3.0], [76.6, 3.0], [76.7, 3.0], [76.8, 3.0], [76.9, 3.0], [77.0, 3.0], [77.1, 3.0], [77.2, 3.0], [77.3, 3.0], [77.4, 3.0], [77.5, 3.0], [77.6, 3.0], [77.7, 3.0], [77.8, 3.0], [77.9, 3.0], [78.0, 3.0], [78.1, 3.0], [78.2, 3.0], [78.3, 3.0], [78.4, 3.0], [78.5, 3.0], [78.6, 3.0], [78.7, 3.0], [78.8, 3.0], [78.9, 3.0], [79.0, 3.0], [79.1, 3.0], [79.2, 3.0], [79.3, 3.0], [79.4, 3.0], [79.5, 3.0], [79.6, 3.0], [79.7, 3.0], [79.8, 3.0], [79.9, 3.0], [80.0, 3.0], [80.1, 3.0], [80.2, 3.0], [80.3, 3.0], [80.4, 3.0], [80.5, 3.0], [80.6, 3.0], [80.7, 3.0], [80.8, 3.0], [80.9, 3.0], [81.0, 3.0], [81.1, 3.0], [81.2, 3.0], [81.3, 3.0], [81.4, 3.0], [81.5, 3.0], [81.6, 3.0], [81.7, 3.0], [81.8, 3.0], [81.9, 3.0], [82.0, 3.0], [82.1, 3.0], [82.2, 3.0], [82.3, 3.0], [82.4, 3.0], [82.5, 3.0], [82.6, 3.0], [82.7, 3.0], [82.8, 3.0], [82.9, 3.0], [83.0, 3.0], [83.1, 3.0], [83.2, 3.0], [83.3, 3.0], [83.4, 3.0], [83.5, 3.0], [83.6, 3.0], [83.7, 3.0], [83.8, 3.0], [83.9, 3.0], [84.0, 3.0], [84.1, 3.0], [84.2, 3.0], [84.3, 3.0], [84.4, 3.0], [84.5, 3.0], [84.6, 3.0], [84.7, 3.0], [84.8, 3.0], [84.9, 3.0], [85.0, 3.0], [85.1, 3.0], [85.2, 3.0], [85.3, 3.0], [85.4, 3.0], [85.5, 3.0], [85.6, 3.0], [85.7, 3.0], [85.8, 3.0], [85.9, 3.0], [86.0, 3.0], [86.1, 3.0], [86.2, 4.0], [86.3, 4.0], [86.4, 4.0], [86.5, 4.0], [86.6, 4.0], [86.7, 4.0], [86.8, 4.0], [86.9, 4.0], [87.0, 4.0], [87.1, 4.0], [87.2, 4.0], [87.3, 4.0], [87.4, 4.0], [87.5, 4.0], [87.6, 4.0], [87.7, 4.0], [87.8, 4.0], [87.9, 4.0], [88.0, 4.0], [88.1, 4.0], [88.2, 4.0], [88.3, 4.0], [88.4, 4.0], [88.5, 4.0], [88.6, 4.0], [88.7, 4.0], [88.8, 4.0], [88.9, 4.0], [89.0, 4.0], [89.1, 4.0], [89.2, 4.0], [89.3, 4.0], [89.4, 4.0], [89.5, 4.0], [89.6, 4.0], [89.7, 4.0], [89.8, 4.0], [89.9, 4.0], [90.0, 4.0], [90.1, 4.0], [90.2, 4.0], [90.3, 4.0], [90.4, 4.0], [90.5, 4.0], [90.6, 4.0], [90.7, 4.0], [90.8, 4.0], [90.9, 4.0], [91.0, 4.0], [91.1, 4.0], [91.2, 4.0], [91.3, 4.0], [91.4, 4.0], [91.5, 4.0], [91.6, 5.0], [91.7, 5.0], [91.8, 5.0], [91.9, 5.0], [92.0, 5.0], [92.1, 5.0], [92.2, 5.0], [92.3, 5.0], [92.4, 5.0], [92.5, 5.0], [92.6, 5.0], [92.7, 5.0], [92.8, 5.0], [92.9, 5.0], [93.0, 5.0], [93.1, 5.0], [93.2, 5.0], [93.3, 5.0], [93.4, 5.0], [93.5, 5.0], [93.6, 5.0], [93.7, 5.0], [93.8, 5.0], [93.9, 5.0], [94.0, 5.0], [94.1, 5.0], [94.2, 5.0], [94.3, 5.0], [94.4, 5.0], [94.5, 5.0], [94.6, 6.0], [94.7, 6.0], [94.8, 6.0], [94.9, 6.0], [95.0, 6.0], [95.1, 6.0], [95.2, 6.0], [95.3, 6.0], [95.4, 6.0], [95.5, 6.0], [95.6, 6.0], [95.7, 6.0], [95.8, 6.0], [95.9, 6.0], [96.0, 6.0], [96.1, 6.0], [96.2, 6.0], [96.3, 6.0], [96.4, 7.0], [96.5, 7.0], [96.6, 7.0], [96.7, 7.0], [96.8, 7.0], [96.9, 7.0], [97.0, 7.0], [97.1, 7.0], [97.2, 7.0], [97.3, 7.0], [97.4, 7.0], [97.5, 8.0], [97.6, 8.0], [97.7, 8.0], [97.8, 8.0], [97.9, 8.0], [98.0, 8.0], [98.1, 8.0], [98.2, 9.0], [98.3, 9.0], [98.4, 9.0], [98.5, 9.0], [98.6, 9.0], [98.7, 10.0], [98.8, 10.0], [98.9, 10.0], [99.0, 11.0], [99.1, 11.0], [99.2, 11.0], [99.3, 12.0], [99.4, 13.0], [99.5, 13.0], [99.6, 14.0], [99.7, 15.0], [99.8, 17.0], [99.9, 19.0], [100.0, 35.0]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 48600.0, "minX": 0.0, "maxY": 48600.0, "series": [{"data": [[0.0, 48600.0]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 4.9E-324, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 48600.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 48600.0, "series": [{"data": [[0.0, 48600.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 4.9E-324, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 1.8909465020576137, "minX": 1.794984133E12, "maxY": 2.5, "series": [{"data": [[1.794984141E12, 1.8909465020576137], [1.79498414E12, 1.9096509240246407], [1.794984139E12, 2.1216494845360816], [1.794984144E12, 2.012320328542092], [1.794984143E12, 2.1864754098360666], [1.794984142E12, 2.155279503105588], [1.794984146E12, 1.9629629629629626], [1.794984145E12, 2.049382716049383], [1.794984149E12, 1.9053497942386823], [1.794984148E12, 2.094845360824743], [1.794984147E12, 1.9279835390946491], [1.794984152E12, 1.915463917525772], [1.794984151E12, 2.1111111111111116], [1.79498415E12, 1.975359342915812], [1.794984133E12, 2.3168724279835406], [1.794984153E12, 2.0], [1.794984136E12, 2.096707818930042], [1.794984135E12, 1.9609053497942395], [1.794984134E12, 2.1030927835051565], [1.794984138E12, 1.9320987654320982], [1.794984137E12, 1.9876796714579046]], "isOverall": false, "label": "One request group 5", "isController": false}, {"data": [[1.794984141E12, 1.936213991769547], [1.79498414E12, 1.9444444444444453], [1.794984139E12, 2.218106995884775], [1.794984144E12, 2.0513347022587287], [1.794984143E12, 2.2315573770491803], [1.794984142E12, 2.099173553719009], [1.794984146E12, 1.9484536082474235], [1.794984145E12, 2.0082304526748995], [1.794984149E12, 1.9032921810699603], [1.794984148E12, 2.0780287474332626], [1.794984147E12, 1.9382716049382704], [1.794984152E12, 1.9546391752577332], [1.794984151E12, 2.131687242798354], [1.79498415E12, 1.979423868312758], [1.794984133E12, 2.3113402061855646], [1.794984153E12, 2.0], [1.794984136E12, 2.1195876288659803], [1.794984135E12, 1.987679671457904], [1.794984134E12, 2.0349794238683154], [1.794984138E12, 1.9814814814814832], [1.794984137E12, 2.065843621399174]], "isOverall": false, "label": "One request group 4", "isController": false}, {"data": [[1.794984141E12, 1.925925925925926], [1.79498414E12, 1.9218106995884772], [1.794984139E12, 2.2103092783505174], [1.794984144E12, 2.039175257731961], [1.794984143E12, 2.209016393442625], [1.794984142E12, 2.0886597938144345], [1.794984146E12, 1.9773195876288667], [1.794984145E12, 2.0657084188911727], [1.794984149E12, 1.9134020618556706], [1.794984148E12, 2.0534979423868327], [1.794984147E12, 1.9096509240246393], [1.794984152E12, 1.9423868312757209], [1.794984151E12, 2.154320987654322], [1.79498415E12, 1.9630390143737177], [1.794984133E12, 2.3422680412371157], [1.794984136E12, 2.059793814432992], [1.794984135E12, 2.03292181069959], [1.794984134E12, 2.053388090349075], [1.794984138E12, 1.9526748971193422], [1.794984137E12, 2.043121149897333]], "isOverall": false, "label": "One request group 1", "isController": false}, {"data": [[1.794984141E12, 1.9260780287474353], [1.79498414E12, 1.9402061855670105], [1.794984139E12, 2.1724845995893234], [1.794984144E12, 2.0205761316872426], [1.794984143E12, 2.202868852459015], [1.794984142E12, 2.128099173553718], [1.794984146E12, 2.010309278350516], [1.794984145E12, 2.0658436213991775], [1.794984149E12, 1.9176954732510283], [1.794984148E12, 2.09670781893004], [1.794984147E12, 1.9240246406570836], [1.794984152E12, 1.9731958762886603], [1.794984151E12, 2.127572016460906], [1.79498415E12, 1.9197530864197525], [1.794984133E12, 2.3251028806584344], [1.794984153E12, 2.0], [1.794984136E12, 2.032854209445584], [1.794984135E12, 1.9979381443298965], [1.794984134E12, 2.104938271604938], [1.794984138E12, 1.9012345679012346], [1.794984137E12, 1.971134020618558]], "isOverall": false, "label": "One request group 3", "isController": false}, {"data": [[1.794984141E12, 1.9547325102880664], [1.79498414E12, 1.9629629629629637], [1.794984139E12, 2.2226804123711332], [1.794984144E12, 2.059670781893008], [1.794984143E12, 2.2295081967213126], [1.794984142E12, 2.0783505154639186], [1.794984146E12, 2.0432989690721666], [1.794984145E12, 2.0699588477366264], [1.794984149E12, 1.9340206185566995], [1.794984148E12, 2.1111111111111103], [1.794984147E12, 1.9404517453798762], [1.794984152E12, 1.9669421487603298], [1.794984151E12, 2.1604938271604954], [1.79498415E12, 1.9733059548254623], [1.794984133E12, 2.3402061855670104], [1.794984153E12, 2.5], [1.794984136E12, 2.02669404517454], [1.794984135E12, 2.0309278350515467], [1.794984134E12, 2.0759753593429173], [1.794984138E12, 1.9320987654320998], [1.794984137E12, 2.0082304526748977]], "isOverall": false, "label": "One request group 2", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794984153E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 1.7483281319661188, "minX": 1.0, "maxY": 20.0, "series": [{"data": [[2.0, 2.3765690376569033], [3.0, 2.37608695652174], [4.0, 2.198090692124106], [5.0, 1.7483281319661188], [6.0, 2.5628537966035485], [7.0, 2.569137725648301], [8.0, 2.6551518761167405], [9.0, 2.772159932303785], [10.0, 3.1094459582197973], [11.0, 4.167616875712657], [12.0, 4.628491620111728], [13.0, 4.734693877551017], [14.0, 4.964163822525601], [15.0, 5.0363984674329405], [16.0, 5.452554744525547], [17.0, 5.507886435331229], [18.0, 5.719999999999995], [19.0, 5.684684684684687], [20.0, 5.494949494949495], [21.0, 6.392857142857143], [22.0, 6.47239263803681], [23.0, 6.232], [24.0, 7.572727272727273], [25.0, 8.209876543209875], [26.0, 8.433333333333334], [27.0, 9.80357142857143], [28.0, 9.652173913043477], [29.0, 9.869565217391303], [30.0, 9.75], [31.0, 10.939393939393941], [32.0, 10.406250000000002], [33.0, 10.200000000000001], [35.0, 13.5625], [34.0, 13.666666666666664], [36.0, 14.555555555555555], [37.0, 13.111111111111112], [39.0, 13.952380952380954], [38.0, 15.94736842105263], [41.0, 17.133333333333333], [40.0, 14.0], [43.0, 15.0], [42.0, 16.846153846153847], [45.0, 14.5], [44.0, 15.5], [47.0, 16.0], [46.0, 14.0], [49.0, 18.0], [48.0, 16.0], [51.0, 16.5], [50.0, 20.0], [1.0, 2.3103448275862064]], "isOverall": false, "label": "write", "isController": false}, {"data": [[8.173518518518392, 2.9262139917695245]], "isOverall": false, "label": "write-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 51.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 2955.0, "minX": 1.794984133E12, "maxY": 1493280.0, "series": [{"data": [[1.794984141E12, 1487772.0], [1.79498414E12, 1487160.0], [1.794984139E12, 1485936.0], [1.794984144E12, 1487772.0], [1.794984143E12, 1493280.0], [1.794984142E12, 1481652.0], [1.794984146E12, 1484712.0], [1.794984145E12, 1487772.0], [1.794984149E12, 1485936.0], [1.794984148E12, 1487160.0], [1.794984147E12, 1488996.0], [1.794984152E12, 1484100.0], [1.794984151E12, 1487160.0], [1.79498415E12, 1488996.0], [1.794984133E12, 1485324.0], [1.794984153E12, 3060.0], [1.794984136E12, 1487160.0], [1.794984135E12, 1486548.0], [1.794984134E12, 1487772.0], [1.794984138E12, 1487160.0], [1.794984137E12, 1487772.0]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.794984141E12, 1436721.0], [1.79498414E12, 1436130.0], [1.794984139E12, 1434948.0], [1.794984144E12, 1436721.0], [1.794984143E12, 1442040.0], [1.794984142E12, 1430811.0], [1.794984146E12, 1433766.0], [1.794984145E12, 1436721.0], [1.794984149E12, 1434948.0], [1.794984148E12, 1436130.0], [1.794984147E12, 1437903.0], [1.794984152E12, 1433175.0], [1.794984151E12, 1436130.0], [1.79498415E12, 1437903.0], [1.794984133E12, 1434357.0], [1.794984153E12, 2955.0], [1.794984136E12, 1436130.0], [1.794984135E12, 1435539.0], [1.794984134E12, 1436721.0], [1.794984138E12, 1436130.0], [1.794984137E12, 1436721.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794984153E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 2.6536243822075787, "minX": 1.794984133E12, "maxY": 3.6, "series": [{"data": [[1.794984141E12, 2.6914849856026266], [1.79498414E12, 2.701646090534975], [1.794984139E12, 3.161449752883035], [1.794984144E12, 2.8798848210612964], [1.794984143E12, 3.280327868852458], [1.794984142E12, 3.0846757538207275], [1.794984146E12, 2.806265457543281], [1.794984145E12, 2.9827231591937453], [1.794984149E12, 2.6536243822075787], [1.794984148E12, 3.0061728395061773], [1.794984147E12, 2.720509658857378], [1.794984152E12, 2.7410309278350447], [1.794984151E12, 3.1213991769547405], [1.79498415E12, 2.7492807233867635], [1.794984133E12, 3.525339925834354], [1.794984153E12, 3.6], [1.794984136E12, 3.004526748971194], [1.794984135E12, 2.8534376286537695], [1.794984134E12, 2.9370629370629335], [1.794984138E12, 2.761316872427981], [1.794984137E12, 2.860551213492392]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794984153E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 2.6416803953871515, "minX": 1.794984133E12, "maxY": 3.6, "series": [{"data": [[1.794984141E12, 2.678321678321682], [1.79498414E12, 2.692181069958851], [1.794984139E12, 3.1466227347611206], [1.794984144E12, 2.866721513780338], [1.794984143E12, 3.2676229508196704], [1.794984142E12, 3.0747624948368477], [1.794984146E12, 2.791426215993402], [1.794984145E12, 2.9699712052653178], [1.794984149E12, 2.6416803953871515], [1.794984148E12, 2.9971193415637885], [1.794984147E12, 2.710234278668311], [1.794984152E12, 2.7319587628865976], [1.794984151E12, 3.113580246913572], [1.79498415E12, 2.7336621454993875], [1.794984133E12, 3.5121549237742116], [1.794984153E12, 3.6], [1.794984136E12, 2.994238683127574], [1.794984135E12, 2.8439687114038747], [1.794984134E12, 2.924310983134513], [1.794984138E12, 2.7485596707818902], [1.794984137E12, 2.854792266556977]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794984153E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.19711340206185546, "minX": 1.794984133E12, "maxY": 0.4, "series": [{"data": [[1.794984141E12, 0.20937885643767987], [1.79498414E12, 0.2041152263374487], [1.794984139E12, 0.2298187808896216], [1.794984144E12, 0.20814479638009092], [1.794984143E12, 0.22377049180327896], [1.794984142E12, 0.21396117306897988], [1.794984146E12, 0.2089859851607582], [1.794984145E12, 0.2069107363225013], [1.794984149E12, 0.19728171334431654], [1.794984148E12, 0.20781893004115246], [1.794984147E12, 0.20715166461159065], [1.794984152E12, 0.19711340206185546], [1.794984151E12, 0.20576131687242788], [1.79498415E12, 0.20920674064940406], [1.794984133E12, 0.3786567779151211], [1.794984153E12, 0.4], [1.794984136E12, 0.33744855967078224], [1.794984135E12, 0.3561136270069992], [1.794984134E12, 0.3706293706293703], [1.794984138E12, 0.2411522633744857], [1.794984137E12, 0.3500617030028805]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794984153E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 1.0, "minX": 1.794984133E12, "maxY": 35.0, "series": [{"data": [[1.794984141E12, 17.0], [1.79498414E12, 14.0], [1.794984139E12, 21.0], [1.794984144E12, 11.0], [1.794984143E12, 27.0], [1.794984142E12, 22.0], [1.794984146E12, 14.0], [1.794984145E12, 22.0], [1.794984149E12, 15.0], [1.794984148E12, 19.0], [1.794984147E12, 13.0], [1.794984152E12, 14.0], [1.794984151E12, 21.0], [1.79498415E12, 16.0], [1.794984133E12, 23.0], [1.794984153E12, 4.0], [1.794984136E12, 22.0], [1.794984135E12, 15.0], [1.794984134E12, 35.0], [1.794984138E12, 13.0], [1.794984137E12, 14.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.794984141E12, 1.0], [1.79498414E12, 1.0], [1.794984139E12, 1.0], [1.794984144E12, 1.0], [1.794984143E12, 1.0], [1.794984142E12, 1.0], [1.794984146E12, 1.0], [1.794984145E12, 1.0], [1.794984149E12, 1.0], [1.794984148E12, 1.0], [1.794984147E12, 1.0], [1.794984152E12, 1.0], [1.794984151E12, 1.0], [1.79498415E12, 1.0], [1.794984133E12, 1.0], [1.794984153E12, 3.0], [1.794984136E12, 1.0], [1.794984135E12, 1.0], [1.794984134E12, 1.0], [1.794984138E12, 1.0], [1.794984137E12, 1.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.794984141E12, 3.0], [1.79498414E12, 4.0], [1.794984139E12, 5.0], [1.794984144E12, 4.800000000000182], [1.794984143E12, 5.0], [1.794984142E12, 5.0], [1.794984146E12, 4.0], [1.794984145E12, 4.0], [1.794984149E12, 3.0], [1.794984148E12, 4.0], [1.794984147E12, 4.0], [1.794984152E12, 4.0], [1.794984151E12, 5.0], [1.79498415E12, 4.0], [1.794984133E12, 6.0], [1.794984153E12, 4.0], [1.794984136E12, 4.0], [1.794984135E12, 4.0], [1.794984134E12, 4.0], [1.794984138E12, 4.0], [1.794984137E12, 4.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.794984141E12, 8.0], [1.79498414E12, 7.0], [1.794984139E12, 14.0], [1.794984144E12, 8.0], [1.794984143E12, 14.590000000000146], [1.794984142E12, 13.0], [1.794984146E12, 10.0], [1.794984145E12, 15.0], [1.794984149E12, 7.0], [1.794984148E12, 12.690000000000055], [1.794984147E12, 8.0], [1.794984152E12, 8.0], [1.794984151E12, 14.0], [1.79498415E12, 7.0], [1.794984133E12, 14.0], [1.794984153E12, 4.0], [1.794984136E12, 12.0], [1.794984135E12, 8.0], [1.794984134E12, 9.0], [1.794984138E12, 8.0], [1.794984137E12, 7.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.794984141E12, 2.0], [1.79498414E12, 3.0], [1.794984139E12, 3.0], [1.794984144E12, 3.0], [1.794984143E12, 3.0], [1.794984142E12, 3.0], [1.794984146E12, 3.0], [1.794984145E12, 3.0], [1.794984149E12, 3.0], [1.794984148E12, 3.0], [1.794984147E12, 3.0], [1.794984152E12, 3.0], [1.794984151E12, 3.0], [1.79498415E12, 3.0], [1.794984133E12, 3.0], [1.794984153E12, 4.0], [1.794984136E12, 3.0], [1.794984135E12, 3.0], [1.794984134E12, 3.0], [1.794984138E12, 3.0], [1.794984137E12, 3.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.794984141E12, 5.0], [1.79498414E12, 5.0], [1.794984139E12, 7.0], [1.794984144E12, 6.0], [1.794984143E12, 9.0], [1.794984142E12, 7.0], [1.794984146E12, 5.0], [1.794984145E12, 6.0], [1.794984149E12, 4.0], [1.794984148E12, 7.0], [1.794984147E12, 5.0], [1.794984152E12, 5.0], [1.794984151E12, 7.0], [1.79498415E12, 5.0], [1.794984133E12, 9.0], [1.794984153E12, 4.0], [1.794984136E12, 6.0], [1.794984135E12, 5.0], [1.794984134E12, 5.0], [1.794984138E12, 5.0], [1.794984137E12, 5.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794984153E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 3.0, "minX": 5.0, "maxY": 4.0, "series": [{"data": [[2427.0, 3.0], [2431.0, 3.0], [2429.0, 3.0], [2430.0, 3.0], [2428.0, 3.0], [2421.0, 3.0], [2426.0, 3.0], [2425.0, 3.0], [2440.0, 3.0], [2433.0, 3.0], [5.0, 4.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 2440.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 3.0, "minX": 5.0, "maxY": 4.0, "series": [{"data": [[2427.0, 3.0], [2431.0, 3.0], [2429.0, 3.0], [2430.0, 3.0], [2428.0, 3.0], [2421.0, 3.0], [2426.0, 3.0], [2425.0, 3.0], [2440.0, 3.0], [2433.0, 3.0], [5.0, 4.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 2440.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 2429.0, "minX": 1.794984133E12, "maxY": 2431.0, "series": [{"data": [[1.794984141E12, 2430.0], [1.79498414E12, 2430.0], [1.794984139E12, 2429.0], [1.794984144E12, 2430.0], [1.794984143E12, 2430.0], [1.794984142E12, 2430.0], [1.794984146E12, 2430.0], [1.794984145E12, 2430.0], [1.794984149E12, 2430.0], [1.794984148E12, 2430.0], [1.794984147E12, 2430.0], [1.794984152E12, 2430.0], [1.794984151E12, 2430.0], [1.79498415E12, 2430.0], [1.794984133E12, 2430.0], [1.794984136E12, 2430.0], [1.794984135E12, 2430.0], [1.794984134E12, 2430.0], [1.794984138E12, 2431.0], [1.794984137E12, 2430.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794984152E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 5.0, "minX": 1.794984133E12, "maxY": 2440.0, "series": [{"data": [[1.794984141E12, 2431.0], [1.79498414E12, 2430.0], [1.794984139E12, 2428.0], [1.794984144E12, 2431.0], [1.794984143E12, 2440.0], [1.794984142E12, 2421.0], [1.794984146E12, 2426.0], [1.794984145E12, 2431.0], [1.794984149E12, 2428.0], [1.794984148E12, 2430.0], [1.794984147E12, 2433.0], [1.794984152E12, 2425.0], [1.794984151E12, 2430.0], [1.79498415E12, 2433.0], [1.794984133E12, 2427.0], [1.794984153E12, 5.0], [1.794984136E12, 2430.0], [1.794984135E12, 2429.0], [1.794984134E12, 2431.0], [1.794984138E12, 2430.0], [1.794984137E12, 2431.0]], "isOverall": false, "label": "201", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794984153E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 5.0, "minX": 1.794984133E12, "maxY": 2440.0, "series": [{"data": [[1.794984141E12, 2431.0], [1.79498414E12, 2430.0], [1.794984139E12, 2428.0], [1.794984144E12, 2431.0], [1.794984143E12, 2440.0], [1.794984142E12, 2421.0], [1.794984146E12, 2426.0], [1.794984145E12, 2431.0], [1.794984149E12, 2428.0], [1.794984148E12, 2430.0], [1.794984147E12, 2433.0], [1.794984152E12, 2425.0], [1.794984151E12, 2430.0], [1.79498415E12, 2433.0], [1.794984133E12, 2427.0], [1.794984153E12, 5.0], [1.794984136E12, 2430.0], [1.794984135E12, 2429.0], [1.794984134E12, 2431.0], [1.794984138E12, 2430.0], [1.794984137E12, 2431.0]], "isOverall": false, "label": "write-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794984153E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 5.0, "minX": 1.794984133E12, "maxY": 2440.0, "series": [{"data": [[1.794984141E12, 2431.0], [1.79498414E12, 2430.0], [1.794984139E12, 2428.0], [1.794984144E12, 2431.0], [1.794984143E12, 2440.0], [1.794984142E12, 2421.0], [1.794984146E12, 2426.0], [1.794984145E12, 2431.0], [1.794984149E12, 2428.0], [1.794984148E12, 2430.0], [1.794984147E12, 2433.0], [1.794984152E12, 2425.0], [1.794984151E12, 2430.0], [1.79498415E12, 2433.0], [1.794984133E12, 2427.0], [1.794984153E12, 5.0], [1.794984136E12, 2430.0], [1.794984135E12, 2429.0], [1.794984134E12, 2431.0], [1.794984138E12, 2430.0], [1.794984137E12, 2431.0]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794984153E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 28800000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

