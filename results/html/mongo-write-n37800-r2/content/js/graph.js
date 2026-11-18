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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 29.0, "series": [{"data": [[0.0, 1.0], [0.1, 1.0], [0.2, 1.0], [0.3, 1.0], [0.4, 1.0], [0.5, 1.0], [0.6, 1.0], [0.7, 1.0], [0.8, 1.0], [0.9, 1.0], [1.0, 1.0], [1.1, 1.0], [1.2, 1.0], [1.3, 1.0], [1.4, 1.0], [1.5, 1.0], [1.6, 1.0], [1.7, 1.0], [1.8, 1.0], [1.9, 1.0], [2.0, 1.0], [2.1, 1.0], [2.2, 1.0], [2.3, 1.0], [2.4, 1.0], [2.5, 1.0], [2.6, 1.0], [2.7, 1.0], [2.8, 1.0], [2.9, 1.0], [3.0, 1.0], [3.1, 1.0], [3.2, 1.0], [3.3, 1.0], [3.4, 1.0], [3.5, 1.0], [3.6, 1.0], [3.7, 1.0], [3.8, 1.0], [3.9, 1.0], [4.0, 1.0], [4.1, 1.0], [4.2, 1.0], [4.3, 1.0], [4.4, 1.0], [4.5, 1.0], [4.6, 1.0], [4.7, 1.0], [4.8, 1.0], [4.9, 1.0], [5.0, 1.0], [5.1, 1.0], [5.2, 1.0], [5.3, 1.0], [5.4, 1.0], [5.5, 1.0], [5.6, 1.0], [5.7, 1.0], [5.8, 1.0], [5.9, 1.0], [6.0, 1.0], [6.1, 1.0], [6.2, 1.0], [6.3, 1.0], [6.4, 1.0], [6.5, 1.0], [6.6, 1.0], [6.7, 1.0], [6.8, 1.0], [6.9, 1.0], [7.0, 1.0], [7.1, 1.0], [7.2, 1.0], [7.3, 1.0], [7.4, 1.0], [7.5, 1.0], [7.6, 1.0], [7.7, 1.0], [7.8, 1.0], [7.9, 1.0], [8.0, 1.0], [8.1, 1.0], [8.2, 1.0], [8.3, 1.0], [8.4, 1.0], [8.5, 1.0], [8.6, 1.0], [8.7, 1.0], [8.8, 1.0], [8.9, 1.0], [9.0, 1.0], [9.1, 1.0], [9.2, 1.0], [9.3, 1.0], [9.4, 1.0], [9.5, 1.0], [9.6, 1.0], [9.7, 1.0], [9.8, 1.0], [9.9, 1.0], [10.0, 1.0], [10.1, 1.0], [10.2, 1.0], [10.3, 1.0], [10.4, 1.0], [10.5, 1.0], [10.6, 1.0], [10.7, 1.0], [10.8, 1.0], [10.9, 1.0], [11.0, 1.0], [11.1, 1.0], [11.2, 1.0], [11.3, 1.0], [11.4, 1.0], [11.5, 1.0], [11.6, 1.0], [11.7, 1.0], [11.8, 1.0], [11.9, 1.0], [12.0, 1.0], [12.1, 1.0], [12.2, 1.0], [12.3, 1.0], [12.4, 1.0], [12.5, 1.0], [12.6, 1.0], [12.7, 1.0], [12.8, 1.0], [12.9, 1.0], [13.0, 1.0], [13.1, 1.0], [13.2, 1.0], [13.3, 1.0], [13.4, 1.0], [13.5, 1.0], [13.6, 1.0], [13.7, 1.0], [13.8, 1.0], [13.9, 1.0], [14.0, 1.0], [14.1, 1.0], [14.2, 1.0], [14.3, 1.0], [14.4, 1.0], [14.5, 1.0], [14.6, 1.0], [14.7, 1.0], [14.8, 1.0], [14.9, 1.0], [15.0, 1.0], [15.1, 1.0], [15.2, 1.0], [15.3, 1.0], [15.4, 1.0], [15.5, 1.0], [15.6, 1.0], [15.7, 1.0], [15.8, 1.0], [15.9, 1.0], [16.0, 1.0], [16.1, 1.0], [16.2, 1.0], [16.3, 1.0], [16.4, 1.0], [16.5, 1.0], [16.6, 1.0], [16.7, 1.0], [16.8, 1.0], [16.9, 1.0], [17.0, 1.0], [17.1, 1.0], [17.2, 1.0], [17.3, 1.0], [17.4, 1.0], [17.5, 1.0], [17.6, 1.0], [17.7, 1.0], [17.8, 1.0], [17.9, 1.0], [18.0, 1.0], [18.1, 1.0], [18.2, 1.0], [18.3, 1.0], [18.4, 1.0], [18.5, 1.0], [18.6, 1.0], [18.7, 1.0], [18.8, 1.0], [18.9, 1.0], [19.0, 1.0], [19.1, 1.0], [19.2, 1.0], [19.3, 1.0], [19.4, 1.0], [19.5, 1.0], [19.6, 1.0], [19.7, 1.0], [19.8, 1.0], [19.9, 1.0], [20.0, 1.0], [20.1, 1.0], [20.2, 1.0], [20.3, 1.0], [20.4, 1.0], [20.5, 1.0], [20.6, 1.0], [20.7, 1.0], [20.8, 1.0], [20.9, 1.0], [21.0, 1.0], [21.1, 1.0], [21.2, 1.0], [21.3, 1.0], [21.4, 1.0], [21.5, 1.0], [21.6, 1.0], [21.7, 2.0], [21.8, 2.0], [21.9, 2.0], [22.0, 2.0], [22.1, 2.0], [22.2, 2.0], [22.3, 2.0], [22.4, 2.0], [22.5, 2.0], [22.6, 2.0], [22.7, 2.0], [22.8, 2.0], [22.9, 2.0], [23.0, 2.0], [23.1, 2.0], [23.2, 2.0], [23.3, 2.0], [23.4, 2.0], [23.5, 2.0], [23.6, 2.0], [23.7, 2.0], [23.8, 2.0], [23.9, 2.0], [24.0, 2.0], [24.1, 2.0], [24.2, 2.0], [24.3, 2.0], [24.4, 2.0], [24.5, 2.0], [24.6, 2.0], [24.7, 2.0], [24.8, 2.0], [24.9, 2.0], [25.0, 2.0], [25.1, 2.0], [25.2, 2.0], [25.3, 2.0], [25.4, 2.0], [25.5, 2.0], [25.6, 2.0], [25.7, 2.0], [25.8, 2.0], [25.9, 2.0], [26.0, 2.0], [26.1, 2.0], [26.2, 2.0], [26.3, 2.0], [26.4, 2.0], [26.5, 2.0], [26.6, 2.0], [26.7, 2.0], [26.8, 2.0], [26.9, 2.0], [27.0, 2.0], [27.1, 2.0], [27.2, 2.0], [27.3, 2.0], [27.4, 2.0], [27.5, 2.0], [27.6, 2.0], [27.7, 2.0], [27.8, 2.0], [27.9, 2.0], [28.0, 2.0], [28.1, 2.0], [28.2, 2.0], [28.3, 2.0], [28.4, 2.0], [28.5, 2.0], [28.6, 2.0], [28.7, 2.0], [28.8, 2.0], [28.9, 2.0], [29.0, 2.0], [29.1, 2.0], [29.2, 2.0], [29.3, 2.0], [29.4, 2.0], [29.5, 2.0], [29.6, 2.0], [29.7, 2.0], [29.8, 2.0], [29.9, 2.0], [30.0, 2.0], [30.1, 2.0], [30.2, 2.0], [30.3, 2.0], [30.4, 2.0], [30.5, 2.0], [30.6, 2.0], [30.7, 2.0], [30.8, 2.0], [30.9, 2.0], [31.0, 2.0], [31.1, 2.0], [31.2, 2.0], [31.3, 2.0], [31.4, 2.0], [31.5, 2.0], [31.6, 2.0], [31.7, 2.0], [31.8, 2.0], [31.9, 2.0], [32.0, 2.0], [32.1, 2.0], [32.2, 2.0], [32.3, 2.0], [32.4, 2.0], [32.5, 2.0], [32.6, 2.0], [32.7, 2.0], [32.8, 2.0], [32.9, 2.0], [33.0, 2.0], [33.1, 2.0], [33.2, 2.0], [33.3, 2.0], [33.4, 2.0], [33.5, 2.0], [33.6, 2.0], [33.7, 2.0], [33.8, 2.0], [33.9, 2.0], [34.0, 2.0], [34.1, 2.0], [34.2, 2.0], [34.3, 2.0], [34.4, 2.0], [34.5, 2.0], [34.6, 2.0], [34.7, 2.0], [34.8, 2.0], [34.9, 2.0], [35.0, 2.0], [35.1, 2.0], [35.2, 2.0], [35.3, 2.0], [35.4, 2.0], [35.5, 2.0], [35.6, 2.0], [35.7, 2.0], [35.8, 2.0], [35.9, 2.0], [36.0, 2.0], [36.1, 2.0], [36.2, 2.0], [36.3, 2.0], [36.4, 2.0], [36.5, 2.0], [36.6, 2.0], [36.7, 2.0], [36.8, 2.0], [36.9, 2.0], [37.0, 2.0], [37.1, 2.0], [37.2, 2.0], [37.3, 2.0], [37.4, 2.0], [37.5, 2.0], [37.6, 2.0], [37.7, 2.0], [37.8, 2.0], [37.9, 2.0], [38.0, 2.0], [38.1, 2.0], [38.2, 2.0], [38.3, 2.0], [38.4, 2.0], [38.5, 2.0], [38.6, 2.0], [38.7, 2.0], [38.8, 2.0], [38.9, 2.0], [39.0, 2.0], [39.1, 2.0], [39.2, 2.0], [39.3, 2.0], [39.4, 2.0], [39.5, 2.0], [39.6, 2.0], [39.7, 2.0], [39.8, 2.0], [39.9, 2.0], [40.0, 2.0], [40.1, 2.0], [40.2, 2.0], [40.3, 2.0], [40.4, 2.0], [40.5, 2.0], [40.6, 2.0], [40.7, 2.0], [40.8, 2.0], [40.9, 2.0], [41.0, 2.0], [41.1, 2.0], [41.2, 2.0], [41.3, 2.0], [41.4, 2.0], [41.5, 2.0], [41.6, 2.0], [41.7, 2.0], [41.8, 2.0], [41.9, 2.0], [42.0, 2.0], [42.1, 2.0], [42.2, 2.0], [42.3, 2.0], [42.4, 2.0], [42.5, 2.0], [42.6, 2.0], [42.7, 2.0], [42.8, 2.0], [42.9, 2.0], [43.0, 2.0], [43.1, 2.0], [43.2, 2.0], [43.3, 2.0], [43.4, 2.0], [43.5, 2.0], [43.6, 2.0], [43.7, 2.0], [43.8, 2.0], [43.9, 2.0], [44.0, 2.0], [44.1, 2.0], [44.2, 2.0], [44.3, 2.0], [44.4, 2.0], [44.5, 2.0], [44.6, 2.0], [44.7, 2.0], [44.8, 2.0], [44.9, 2.0], [45.0, 2.0], [45.1, 2.0], [45.2, 2.0], [45.3, 2.0], [45.4, 2.0], [45.5, 2.0], [45.6, 2.0], [45.7, 2.0], [45.8, 2.0], [45.9, 2.0], [46.0, 2.0], [46.1, 2.0], [46.2, 2.0], [46.3, 2.0], [46.4, 2.0], [46.5, 2.0], [46.6, 2.0], [46.7, 2.0], [46.8, 2.0], [46.9, 2.0], [47.0, 2.0], [47.1, 2.0], [47.2, 2.0], [47.3, 2.0], [47.4, 2.0], [47.5, 2.0], [47.6, 2.0], [47.7, 2.0], [47.8, 2.0], [47.9, 2.0], [48.0, 2.0], [48.1, 2.0], [48.2, 2.0], [48.3, 2.0], [48.4, 2.0], [48.5, 2.0], [48.6, 2.0], [48.7, 2.0], [48.8, 2.0], [48.9, 2.0], [49.0, 2.0], [49.1, 2.0], [49.2, 2.0], [49.3, 2.0], [49.4, 2.0], [49.5, 2.0], [49.6, 2.0], [49.7, 2.0], [49.8, 2.0], [49.9, 2.0], [50.0, 2.0], [50.1, 2.0], [50.2, 2.0], [50.3, 2.0], [50.4, 2.0], [50.5, 2.0], [50.6, 2.0], [50.7, 2.0], [50.8, 2.0], [50.9, 2.0], [51.0, 2.0], [51.1, 2.0], [51.2, 2.0], [51.3, 2.0], [51.4, 2.0], [51.5, 2.0], [51.6, 2.0], [51.7, 2.0], [51.8, 2.0], [51.9, 2.0], [52.0, 2.0], [52.1, 2.0], [52.2, 2.0], [52.3, 2.0], [52.4, 2.0], [52.5, 2.0], [52.6, 2.0], [52.7, 2.0], [52.8, 2.0], [52.9, 2.0], [53.0, 2.0], [53.1, 2.0], [53.2, 2.0], [53.3, 2.0], [53.4, 2.0], [53.5, 2.0], [53.6, 2.0], [53.7, 2.0], [53.8, 2.0], [53.9, 2.0], [54.0, 2.0], [54.1, 2.0], [54.2, 2.0], [54.3, 2.0], [54.4, 2.0], [54.5, 2.0], [54.6, 2.0], [54.7, 2.0], [54.8, 2.0], [54.9, 2.0], [55.0, 2.0], [55.1, 2.0], [55.2, 2.0], [55.3, 2.0], [55.4, 2.0], [55.5, 2.0], [55.6, 2.0], [55.7, 2.0], [55.8, 2.0], [55.9, 2.0], [56.0, 2.0], [56.1, 2.0], [56.2, 2.0], [56.3, 2.0], [56.4, 2.0], [56.5, 2.0], [56.6, 2.0], [56.7, 2.0], [56.8, 2.0], [56.9, 2.0], [57.0, 2.0], [57.1, 2.0], [57.2, 2.0], [57.3, 2.0], [57.4, 2.0], [57.5, 2.0], [57.6, 2.0], [57.7, 2.0], [57.8, 2.0], [57.9, 2.0], [58.0, 2.0], [58.1, 2.0], [58.2, 2.0], [58.3, 2.0], [58.4, 2.0], [58.5, 2.0], [58.6, 2.0], [58.7, 2.0], [58.8, 2.0], [58.9, 2.0], [59.0, 2.0], [59.1, 2.0], [59.2, 2.0], [59.3, 2.0], [59.4, 2.0], [59.5, 2.0], [59.6, 2.0], [59.7, 2.0], [59.8, 2.0], [59.9, 2.0], [60.0, 2.0], [60.1, 2.0], [60.2, 2.0], [60.3, 2.0], [60.4, 2.0], [60.5, 2.0], [60.6, 2.0], [60.7, 2.0], [60.8, 2.0], [60.9, 2.0], [61.0, 2.0], [61.1, 2.0], [61.2, 2.0], [61.3, 2.0], [61.4, 2.0], [61.5, 2.0], [61.6, 2.0], [61.7, 2.0], [61.8, 2.0], [61.9, 2.0], [62.0, 2.0], [62.1, 2.0], [62.2, 2.0], [62.3, 2.0], [62.4, 2.0], [62.5, 2.0], [62.6, 2.0], [62.7, 2.0], [62.8, 2.0], [62.9, 2.0], [63.0, 2.0], [63.1, 2.0], [63.2, 2.0], [63.3, 2.0], [63.4, 2.0], [63.5, 2.0], [63.6, 2.0], [63.7, 2.0], [63.8, 2.0], [63.9, 2.0], [64.0, 2.0], [64.1, 2.0], [64.2, 2.0], [64.3, 2.0], [64.4, 2.0], [64.5, 2.0], [64.6, 2.0], [64.7, 2.0], [64.8, 2.0], [64.9, 2.0], [65.0, 2.0], [65.1, 2.0], [65.2, 2.0], [65.3, 2.0], [65.4, 2.0], [65.5, 2.0], [65.6, 2.0], [65.7, 2.0], [65.8, 2.0], [65.9, 2.0], [66.0, 2.0], [66.1, 2.0], [66.2, 2.0], [66.3, 2.0], [66.4, 2.0], [66.5, 2.0], [66.6, 2.0], [66.7, 2.0], [66.8, 2.0], [66.9, 2.0], [67.0, 2.0], [67.1, 2.0], [67.2, 2.0], [67.3, 2.0], [67.4, 2.0], [67.5, 2.0], [67.6, 2.0], [67.7, 2.0], [67.8, 2.0], [67.9, 2.0], [68.0, 2.0], [68.1, 2.0], [68.2, 2.0], [68.3, 2.0], [68.4, 2.0], [68.5, 2.0], [68.6, 2.0], [68.7, 2.0], [68.8, 3.0], [68.9, 3.0], [69.0, 3.0], [69.1, 3.0], [69.2, 3.0], [69.3, 3.0], [69.4, 3.0], [69.5, 3.0], [69.6, 3.0], [69.7, 3.0], [69.8, 3.0], [69.9, 3.0], [70.0, 3.0], [70.1, 3.0], [70.2, 3.0], [70.3, 3.0], [70.4, 3.0], [70.5, 3.0], [70.6, 3.0], [70.7, 3.0], [70.8, 3.0], [70.9, 3.0], [71.0, 3.0], [71.1, 3.0], [71.2, 3.0], [71.3, 3.0], [71.4, 3.0], [71.5, 3.0], [71.6, 3.0], [71.7, 3.0], [71.8, 3.0], [71.9, 3.0], [72.0, 3.0], [72.1, 3.0], [72.2, 3.0], [72.3, 3.0], [72.4, 3.0], [72.5, 3.0], [72.6, 3.0], [72.7, 3.0], [72.8, 3.0], [72.9, 3.0], [73.0, 3.0], [73.1, 3.0], [73.2, 3.0], [73.3, 3.0], [73.4, 3.0], [73.5, 3.0], [73.6, 3.0], [73.7, 3.0], [73.8, 3.0], [73.9, 3.0], [74.0, 3.0], [74.1, 3.0], [74.2, 3.0], [74.3, 3.0], [74.4, 3.0], [74.5, 3.0], [74.6, 3.0], [74.7, 3.0], [74.8, 3.0], [74.9, 3.0], [75.0, 3.0], [75.1, 3.0], [75.2, 3.0], [75.3, 3.0], [75.4, 3.0], [75.5, 3.0], [75.6, 3.0], [75.7, 3.0], [75.8, 3.0], [75.9, 3.0], [76.0, 3.0], [76.1, 3.0], [76.2, 3.0], [76.3, 3.0], [76.4, 3.0], [76.5, 3.0], [76.6, 3.0], [76.7, 3.0], [76.8, 3.0], [76.9, 3.0], [77.0, 3.0], [77.1, 3.0], [77.2, 3.0], [77.3, 3.0], [77.4, 3.0], [77.5, 3.0], [77.6, 3.0], [77.7, 3.0], [77.8, 3.0], [77.9, 3.0], [78.0, 3.0], [78.1, 3.0], [78.2, 3.0], [78.3, 3.0], [78.4, 3.0], [78.5, 3.0], [78.6, 3.0], [78.7, 3.0], [78.8, 3.0], [78.9, 3.0], [79.0, 3.0], [79.1, 3.0], [79.2, 3.0], [79.3, 3.0], [79.4, 3.0], [79.5, 3.0], [79.6, 3.0], [79.7, 3.0], [79.8, 3.0], [79.9, 3.0], [80.0, 3.0], [80.1, 3.0], [80.2, 3.0], [80.3, 3.0], [80.4, 3.0], [80.5, 3.0], [80.6, 3.0], [80.7, 3.0], [80.8, 3.0], [80.9, 3.0], [81.0, 3.0], [81.1, 3.0], [81.2, 3.0], [81.3, 3.0], [81.4, 3.0], [81.5, 3.0], [81.6, 3.0], [81.7, 3.0], [81.8, 3.0], [81.9, 3.0], [82.0, 3.0], [82.1, 3.0], [82.2, 3.0], [82.3, 3.0], [82.4, 3.0], [82.5, 3.0], [82.6, 3.0], [82.7, 3.0], [82.8, 3.0], [82.9, 3.0], [83.0, 3.0], [83.1, 3.0], [83.2, 3.0], [83.3, 3.0], [83.4, 3.0], [83.5, 3.0], [83.6, 3.0], [83.7, 3.0], [83.8, 3.0], [83.9, 3.0], [84.0, 3.0], [84.1, 3.0], [84.2, 3.0], [84.3, 3.0], [84.4, 3.0], [84.5, 3.0], [84.6, 3.0], [84.7, 3.0], [84.8, 3.0], [84.9, 3.0], [85.0, 3.0], [85.1, 3.0], [85.2, 3.0], [85.3, 3.0], [85.4, 3.0], [85.5, 3.0], [85.6, 3.0], [85.7, 3.0], [85.8, 3.0], [85.9, 3.0], [86.0, 3.0], [86.1, 3.0], [86.2, 3.0], [86.3, 3.0], [86.4, 3.0], [86.5, 3.0], [86.6, 3.0], [86.7, 3.0], [86.8, 3.0], [86.9, 3.0], [87.0, 3.0], [87.1, 3.0], [87.2, 3.0], [87.3, 3.0], [87.4, 3.0], [87.5, 3.0], [87.6, 3.0], [87.7, 3.0], [87.8, 3.0], [87.9, 3.0], [88.0, 3.0], [88.1, 3.0], [88.2, 3.0], [88.3, 3.0], [88.4, 3.0], [88.5, 3.0], [88.6, 3.0], [88.7, 3.0], [88.8, 3.0], [88.9, 3.0], [89.0, 3.0], [89.1, 3.0], [89.2, 3.0], [89.3, 3.0], [89.4, 3.0], [89.5, 3.0], [89.6, 3.0], [89.7, 3.0], [89.8, 3.0], [89.9, 3.0], [90.0, 3.0], [90.1, 3.0], [90.2, 3.0], [90.3, 3.0], [90.4, 3.0], [90.5, 3.0], [90.6, 4.0], [90.7, 4.0], [90.8, 4.0], [90.9, 4.0], [91.0, 4.0], [91.1, 4.0], [91.2, 4.0], [91.3, 4.0], [91.4, 4.0], [91.5, 4.0], [91.6, 4.0], [91.7, 4.0], [91.8, 4.0], [91.9, 4.0], [92.0, 4.0], [92.1, 4.0], [92.2, 4.0], [92.3, 4.0], [92.4, 4.0], [92.5, 4.0], [92.6, 4.0], [92.7, 4.0], [92.8, 4.0], [92.9, 4.0], [93.0, 4.0], [93.1, 4.0], [93.2, 4.0], [93.3, 4.0], [93.4, 4.0], [93.5, 4.0], [93.6, 4.0], [93.7, 4.0], [93.8, 4.0], [93.9, 4.0], [94.0, 4.0], [94.1, 4.0], [94.2, 4.0], [94.3, 4.0], [94.4, 4.0], [94.5, 4.0], [94.6, 4.0], [94.7, 4.0], [94.8, 4.0], [94.9, 4.0], [95.0, 4.0], [95.1, 4.0], [95.2, 4.0], [95.3, 4.0], [95.4, 4.0], [95.5, 4.0], [95.6, 4.0], [95.7, 4.0], [95.8, 4.0], [95.9, 4.0], [96.0, 4.0], [96.1, 4.0], [96.2, 4.0], [96.3, 4.0], [96.4, 4.0], [96.5, 4.0], [96.6, 4.0], [96.7, 4.0], [96.8, 5.0], [96.9, 5.0], [97.0, 5.0], [97.1, 5.0], [97.2, 5.0], [97.3, 5.0], [97.4, 5.0], [97.5, 5.0], [97.6, 5.0], [97.7, 5.0], [97.8, 5.0], [97.9, 5.0], [98.0, 5.0], [98.1, 5.0], [98.2, 6.0], [98.3, 6.0], [98.4, 6.0], [98.5, 6.0], [98.6, 6.0], [98.7, 7.0], [98.8, 7.0], [98.9, 7.0], [99.0, 7.0], [99.1, 8.0], [99.2, 8.0], [99.3, 8.0], [99.4, 9.0], [99.5, 9.0], [99.6, 10.0], [99.7, 11.0], [99.8, 14.0], [99.9, 16.0]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 22512.0, "minX": 0.0, "maxY": 22512.0, "series": [{"data": [[0.0, 22512.0]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 4.9E-324, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 22512.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 22512.0, "series": [{"data": [[0.0, 22512.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 4.9E-324, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 1.0, "minX": 1.794978843E12, "maxY": 1.3423076923076926, "series": [{"data": [[1.794978851E12, 1.0204081632653064], [1.794978852E12, 1.004761904761905], [1.794978853E12, 1.0195121951219517], [1.794978849E12, 1.0098522167487691], [1.79497885E12, 1.0312500000000004], [1.794978857E12, 1.145833333333334], [1.794978858E12, 1.3166023166023166], [1.794978854E12, 1.0113636363636365], [1.794978855E12, 1.1144278606965168], [1.794978856E12, 1.0655021834061127], [1.794978862E12, 1.1461794019933562], [1.794978863E12, 1.208333333333334], [1.794978859E12, 1.2204081632653063], [1.79497886E12, 1.1766666666666663], [1.794978861E12, 1.206293706293707], [1.794978846E12, 1.0093457943925233], [1.794978847E12, 1.0325581395348835], [1.794978848E12, 1.0439024390243896], [1.794978843E12, 1.0242424242424244], [1.794978844E12, 1.057471264367815], [1.794978845E12, 1.0235849056603776]], "isOverall": false, "label": "One request group 5", "isController": false}, {"data": [[1.794978851E12, 1.0256410256410262], [1.794978852E12, 1.0094339622641515], [1.794978853E12, 1.0492610837438425], [1.794978849E12, 1.0243902439024397], [1.79497885E12, 1.0259067357512959], [1.794978857E12, 1.1626297577854676], [1.794978858E12, 1.2857142857142854], [1.794978854E12, 1.0171428571428573], [1.794978855E12, 1.1477832512315282], [1.794978856E12, 1.0655021834061131], [1.794978862E12, 1.1546052631578951], [1.794978863E12, 1.2173913043478266], [1.794978859E12, 1.204918032786885], [1.79497886E12, 1.1399999999999992], [1.794978861E12, 1.1789473684210516], [1.794978846E12, 1.0], [1.794978847E12, 1.0], [1.794978848E12, 1.0392156862745094], [1.794978843E12, 1.0542168674698804], [1.794978844E12, 1.0350877192982468], [1.794978845E12, 1.018691588785047]], "isOverall": false, "label": "One request group 4", "isController": false}, {"data": [[1.794978851E12, 1.0154639175257738], [1.794978852E12, 1.0096153846153846], [1.794978853E12, 1.0295566502463058], [1.794978849E12, 1.024630541871922], [1.79497885E12, 1.0104712041884825], [1.794978857E12, 1.0934256055363323], [1.794978858E12, 1.2911877394636015], [1.794978854E12, 1.022857142857143], [1.794978855E12, 1.1470588235294115], [1.794978856E12, 1.092105263157895], [1.794978862E12, 1.1282894736842106], [1.794978863E12, 1.2608695652173914], [1.794978859E12, 1.2520661157024795], [1.79497886E12, 1.1262458471760806], [1.794978861E12, 1.1894736842105262], [1.794978846E12, 1.0325581395348833], [1.794978847E12, 1.0186046511627915], [1.794978848E12, 1.0344827586206893], [1.794978843E12, 1.0481927710843384], [1.794978844E12, 1.0404624277456658], [1.794978845E12, 1.0328638497652585]], "isOverall": false, "label": "One request group 1", "isController": false}, {"data": [[1.794978851E12, 1.01530612244898], [1.794978852E12, 1.0188679245283025], [1.794978853E12, 1.0247524752475254], [1.794978849E12, 1.0246305418719213], [1.79497885E12, 1.010362694300519], [1.794978857E12, 1.1038062283737022], [1.794978858E12, 1.3423076923076926], [1.794978854E12, 1.0114942528735633], [1.794978855E12, 1.1231527093596054], [1.794978856E12, 1.0698689956331882], [1.794978862E12, 1.1901639344262283], [1.794978863E12, 1.2173913043478264], [1.794978859E12, 1.2081632653061234], [1.79497886E12, 1.1158940397350994], [1.794978861E12, 1.178947368421052], [1.794978846E12, 1.0140845070422544], [1.794978847E12, 1.0232558139534889], [1.794978848E12, 1.0242718446601948], [1.794978843E12, 1.0535714285714295], [1.794978844E12, 1.0232558139534882], [1.794978845E12, 1.0281690140845074]], "isOverall": false, "label": "One request group 3", "isController": false}, {"data": [[1.794978851E12, 1.0151515151515156], [1.794978852E12, 1.0142857142857142], [1.794978853E12, 1.0497512437810947], [1.794978849E12, 1.0199004975124384], [1.79497885E12, 1.0309278350515472], [1.794978857E12, 1.114583333333333], [1.794978858E12, 1.3294573643410859], [1.794978854E12, 1.0171428571428573], [1.794978855E12, 1.113861386138614], [1.794978856E12, 1.0921052631578951], [1.794978862E12, 1.1414473684210538], [1.794978863E12, 1.2173913043478266], [1.794978859E12, 1.1918367346938774], [1.79497886E12, 1.1225165562913901], [1.794978861E12, 1.1888111888111887], [1.794978846E12, 1.0186915887850472], [1.794978847E12, 1.0092592592592597], [1.794978848E12, 1.0386473429951697], [1.794978843E12, 1.0484848484848495], [1.794978844E12, 1.0520231213872835], [1.794978845E12, 1.0140845070422544]], "isOverall": false, "label": "One request group 2", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978863E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 1.8983143012506811, "minX": 1.0, "maxY": 18.0, "series": [{"data": [[2.0, 2.1188788659793825], [3.0, 2.04875172007077], [4.0, 2.09147869674186], [5.0, 2.2366190360862137], [6.0, 3.3147574819401457], [7.0, 3.798627002288328], [8.0, 4.453201970443346], [9.0, 5.304347826086958], [10.0, 6.229166666666667], [11.0, 7.166666666666666], [12.0, 8.10344827586207], [13.0, 7.6315789473684195], [14.0, 10.2], [15.0, 7.7142857142857135], [1.0, 1.8983143012506811], [16.0, 9.615384615384615], [17.0, 9.666666666666666], [18.0, 11.666666666666666], [19.0, 9.75], [20.0, 12.6], [21.0, 10.666666666666666], [22.0, 9.666666666666666], [23.0, 11.727272727272728], [24.0, 10.0], [25.0, 18.0], [26.0, 18.0], [27.0, 14.25], [28.0, 11.0], [29.0, 11.0], [30.0, 15.5], [31.0, 17.333333333333332]], "isOverall": false, "label": "write", "isController": false}, {"data": [[3.7595948827292145, 2.2939321250888383]], "isOverall": false, "label": "write-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 31.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 68324.0, "minX": 1.794978843E12, "maxY": 925980.0, "series": [{"data": [[1.794978851E12, 597190.0], [1.794978852E12, 641720.0], [1.794978853E12, 618540.0], [1.794978849E12, 619150.0], [1.79497885E12, 587430.0], [1.794978857E12, 880230.0], [1.794978858E12, 791170.0], [1.794978854E12, 533750.0], [1.794978855E12, 617930.0], [1.794978856E12, 697230.0], [1.794978862E12, 925980.0], [1.794978863E12, 70760.0], [1.794978859E12, 744810.0], [1.79497886E12, 918050.0], [1.794978861E12, 870470.0], [1.794978846E12, 653310.0], [1.794978847E12, 656970.0], [1.794978848E12, 625250.0], [1.794978843E12, 506300.0], [1.794978844E12, 526430.0], [1.794978845E12, 649650.0]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.794978851E12, 576631.0], [1.794978852E12, 619628.0], [1.794978853E12, 597246.0], [1.794978849E12, 597835.0], [1.79497885E12, 567207.0], [1.794978857E12, 849927.0], [1.794978858E12, 763933.0], [1.794978854E12, 515375.0], [1.794978855E12, 596657.0], [1.794978856E12, 673227.0], [1.794978862E12, 894102.0], [1.794978863E12, 68324.0], [1.794978859E12, 719169.0], [1.79497886E12, 886445.0], [1.794978861E12, 840503.0], [1.794978846E12, 630819.0], [1.794978847E12, 634353.0], [1.794978848E12, 603725.0], [1.794978843E12, 488870.0], [1.794978844E12, 508307.0], [1.794978845E12, 627285.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978863E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 2.0826996197718586, "minX": 1.794978843E12, "maxY": 2.9360061680801848, "series": [{"data": [[1.794978851E12, 2.2196118488253322], [1.794978852E12, 2.0826996197718586], [1.794978853E12, 2.203155818540432], [1.794978849E12, 2.1970443349753683], [1.79497885E12, 2.1921079958463103], [1.794978857E12, 2.264033264033265], [1.794978858E12, 2.9360061680801848], [1.794978854E12, 2.104000000000002], [1.794978855E12, 2.3455083909180674], [1.794978856E12, 2.1714785651793513], [1.794978862E12, 2.3227931488801072], [1.794978863E12, 2.663793103448276], [1.794978859E12, 2.637182637182639], [1.79497886E12, 2.3215946843853827], [1.794978861E12, 2.44148563419762], [1.794978846E12, 2.1213818860877667], [1.794978847E12, 2.099350046425258], [1.794978848E12, 2.1980487804878055], [1.794978843E12, 2.336144578313251], [1.794978844E12, 2.229432213209728], [1.794978845E12, 2.1089201877934274]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978863E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 2.075095057034218, "minX": 1.794978843E12, "maxY": 2.9267540478026253, "series": [{"data": [[1.794978851E12, 2.210418794688458], [1.794978852E12, 2.075095057034218], [1.794978853E12, 2.195266272189345], [1.794978849E12, 2.1881773399014803], [1.79497885E12, 2.1796469366562845], [1.794978857E12, 2.2515592515592506], [1.794978858E12, 2.9267540478026253], [1.794978854E12, 2.0959999999999996], [1.794978855E12, 2.338598223099706], [1.794978856E12, 2.163604549431318], [1.794978862E12, 2.3181818181818215], [1.794978863E12, 2.6465517241379306], [1.794978859E12, 2.626535626535623], [1.79497886E12, 2.313621262458468], [1.794978861E12, 2.436580238262085], [1.794978846E12, 2.1167133520074723], [1.794978847E12, 2.093779015784586], [1.794978848E12, 2.1912195121951195], [1.794978843E12, 2.3216867469879516], [1.794978844E12, 2.222479721900347], [1.794978845E12, 2.104225352112678]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978863E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.17168885774351814, "minX": 1.794978843E12, "maxY": 0.2428430404738399, "series": [{"data": [[1.794978851E12, 0.19713993871297258], [1.794978852E12, 0.21292775665399238], [1.794978853E12, 0.1972386587771202], [1.794978849E12, 0.20591133004926096], [1.79497885E12, 0.1952232606438213], [1.794978857E12, 0.22176022176022178], [1.794978858E12, 0.20046260601387803], [1.794978854E12, 0.19999999999999996], [1.794978855E12, 0.2428430404738399], [1.794978856E12, 0.21872265966754173], [1.794978862E12, 0.20026350461133055], [1.794978863E12, 0.22413793103448287], [1.794978859E12, 0.20638820638820635], [1.79497886E12, 0.20332225913621235], [1.794978861E12, 0.17168885774351814], [1.794978846E12, 0.20168067226890762], [1.794978847E12, 0.20705663881151332], [1.794978848E12, 0.2087804878048781], [1.794978843E12, 0.22289156626506001], [1.794978844E12, 0.2236384704519118], [1.794978845E12, 0.2169014084507042]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978863E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 1.0, "minX": 1.794978843E12, "maxY": 29.0, "series": [{"data": [[1.794978851E12, 8.0], [1.794978852E12, 8.0], [1.794978853E12, 14.0], [1.794978849E12, 9.0], [1.79497885E12, 8.0], [1.794978857E12, 7.0], [1.794978858E12, 29.0], [1.794978854E12, 9.0], [1.794978855E12, 10.0], [1.794978856E12, 7.0], [1.794978862E12, 7.0], [1.794978863E12, 6.0], [1.794978859E12, 21.0], [1.79497886E12, 10.0], [1.794978861E12, 14.0], [1.794978846E12, 13.0], [1.794978847E12, 9.0], [1.794978848E12, 14.0], [1.794978843E12, 11.0], [1.794978844E12, 15.0], [1.794978845E12, 10.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.794978851E12, 1.0], [1.794978852E12, 1.0], [1.794978853E12, 1.0], [1.794978849E12, 1.0], [1.79497885E12, 1.0], [1.794978857E12, 1.0], [1.794978858E12, 1.0], [1.794978854E12, 1.0], [1.794978855E12, 1.0], [1.794978856E12, 1.0], [1.794978862E12, 1.0], [1.794978863E12, 1.0], [1.794978859E12, 1.0], [1.79497886E12, 1.0], [1.794978861E12, 1.0], [1.794978846E12, 1.0], [1.794978847E12, 1.0], [1.794978848E12, 1.0], [1.794978843E12, 1.0], [1.794978844E12, 1.0], [1.794978845E12, 1.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.794978851E12, 3.0], [1.794978852E12, 3.0], [1.794978853E12, 3.0], [1.794978849E12, 3.0], [1.79497885E12, 3.0], [1.794978857E12, 3.0], [1.794978858E12, 4.2000000000000455], [1.794978854E12, 3.0], [1.794978855E12, 4.0], [1.794978856E12, 3.0], [1.794978862E12, 4.0], [1.794978863E12, 4.0], [1.794978859E12, 4.0], [1.79497886E12, 3.0], [1.794978861E12, 4.0], [1.794978846E12, 3.0], [1.794978847E12, 3.0], [1.794978848E12, 3.0], [1.794978843E12, 4.0], [1.794978844E12, 3.0], [1.794978845E12, 3.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.794978851E12, 6.0], [1.794978852E12, 4.0], [1.794978853E12, 7.850000000000023], [1.794978849E12, 5.840000000000032], [1.79497885E12, 5.0], [1.794978857E12, 6.0], [1.794978858E12, 17.019999999999982], [1.794978854E12, 6.0], [1.794978855E12, 7.0], [1.794978856E12, 5.0], [1.794978862E12, 5.0], [1.794978863E12, 6.0], [1.794978859E12, 12.0], [1.79497886E12, 7.0], [1.794978861E12, 8.0], [1.794978846E12, 5.0], [1.794978847E12, 5.0], [1.794978848E12, 8.0], [1.794978843E12, 8.0], [1.794978844E12, 7.0], [1.794978845E12, 6.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.794978851E12, 2.0], [1.794978852E12, 2.0], [1.794978853E12, 2.0], [1.794978849E12, 2.0], [1.79497885E12, 2.0], [1.794978857E12, 2.0], [1.794978858E12, 2.0], [1.794978854E12, 2.0], [1.794978855E12, 2.0], [1.794978856E12, 2.0], [1.794978862E12, 2.0], [1.794978863E12, 2.5], [1.794978859E12, 2.0], [1.79497886E12, 2.0], [1.794978861E12, 2.0], [1.794978846E12, 2.0], [1.794978847E12, 2.0], [1.794978848E12, 2.0], [1.794978843E12, 2.0], [1.794978844E12, 2.0], [1.794978845E12, 2.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.794978851E12, 4.0], [1.794978852E12, 4.0], [1.794978853E12, 4.0], [1.794978849E12, 4.0], [1.79497885E12, 4.0], [1.794978857E12, 4.0], [1.794978858E12, 8.0], [1.794978854E12, 4.0], [1.794978855E12, 4.0], [1.794978856E12, 4.0], [1.794978862E12, 4.0], [1.794978863E12, 5.0], [1.794978859E12, 6.0], [1.79497886E12, 4.0], [1.794978861E12, 4.0], [1.794978846E12, 4.0], [1.794978847E12, 4.0], [1.794978848E12, 4.0], [1.794978843E12, 4.0], [1.794978844E12, 4.0], [1.794978845E12, 4.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978863E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 2.0, "minX": 116.0, "maxY": 2.5, "series": [{"data": [[830.0, 2.0], [863.0, 2.0], [875.0, 2.0], [963.0, 2.0], [979.0, 2.0], [1015.0, 2.0], [1014.0, 2.0], [1013.0, 2.0], [1065.0, 2.0], [1071.0, 2.0], [1077.0, 2.0], [1025.0, 2.0], [1052.0, 2.0], [1143.0, 2.0], [1221.0, 2.0], [1297.0, 2.0], [1443.0, 2.0], [1427.0, 2.0], [1505.0, 2.0], [1518.0, 2.0], [116.0, 2.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1518.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 2.0, "minX": 116.0, "maxY": 2.0, "series": [{"data": [[830.0, 2.0], [863.0, 2.0], [875.0, 2.0], [963.0, 2.0], [979.0, 2.0], [1015.0, 2.0], [1014.0, 2.0], [1013.0, 2.0], [1065.0, 2.0], [1071.0, 2.0], [1077.0, 2.0], [1025.0, 2.0], [1052.0, 2.0], [1143.0, 2.0], [1221.0, 2.0], [1297.0, 2.0], [1443.0, 2.0], [1427.0, 2.0], [1505.0, 2.0], [1518.0, 2.0], [116.0, 2.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1518.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 110.0, "minX": 1.794978843E12, "maxY": 1520.0, "series": [{"data": [[1.794978851E12, 975.0], [1.794978852E12, 1052.0], [1.794978853E12, 1017.0], [1.794978849E12, 1014.0], [1.79497885E12, 964.0], [1.794978857E12, 1441.0], [1.794978858E12, 1299.0], [1.794978854E12, 874.0], [1.794978855E12, 1012.0], [1.794978856E12, 1145.0], [1.794978862E12, 1520.0], [1.794978863E12, 110.0], [1.794978859E12, 1221.0], [1.79497886E12, 1504.0], [1.794978861E12, 1429.0], [1.794978846E12, 1074.0], [1.794978847E12, 1077.0], [1.794978848E12, 1025.0], [1.794978843E12, 834.0], [1.794978844E12, 861.0], [1.794978845E12, 1064.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978863E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 116.0, "minX": 1.794978843E12, "maxY": 1518.0, "series": [{"data": [[1.794978851E12, 979.0], [1.794978852E12, 1052.0], [1.794978853E12, 1014.0], [1.794978849E12, 1015.0], [1.79497885E12, 963.0], [1.794978857E12, 1443.0], [1.794978858E12, 1297.0], [1.794978854E12, 875.0], [1.794978855E12, 1013.0], [1.794978856E12, 1143.0], [1.794978862E12, 1518.0], [1.794978863E12, 116.0], [1.794978859E12, 1221.0], [1.79497886E12, 1505.0], [1.794978861E12, 1427.0], [1.794978846E12, 1071.0], [1.794978847E12, 1077.0], [1.794978848E12, 1025.0], [1.794978843E12, 830.0], [1.794978844E12, 863.0], [1.794978845E12, 1065.0]], "isOverall": false, "label": "201", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978863E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 116.0, "minX": 1.794978843E12, "maxY": 1518.0, "series": [{"data": [[1.794978851E12, 979.0], [1.794978852E12, 1052.0], [1.794978853E12, 1014.0], [1.794978849E12, 1015.0], [1.79497885E12, 963.0], [1.794978857E12, 1443.0], [1.794978858E12, 1297.0], [1.794978854E12, 875.0], [1.794978855E12, 1013.0], [1.794978856E12, 1143.0], [1.794978862E12, 1518.0], [1.794978863E12, 116.0], [1.794978859E12, 1221.0], [1.79497886E12, 1505.0], [1.794978861E12, 1427.0], [1.794978846E12, 1071.0], [1.794978847E12, 1077.0], [1.794978848E12, 1025.0], [1.794978843E12, 830.0], [1.794978844E12, 863.0], [1.794978845E12, 1065.0]], "isOverall": false, "label": "write-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978863E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 116.0, "minX": 1.794978843E12, "maxY": 1518.0, "series": [{"data": [[1.794978851E12, 979.0], [1.794978852E12, 1052.0], [1.794978853E12, 1014.0], [1.794978849E12, 1015.0], [1.79497885E12, 963.0], [1.794978857E12, 1443.0], [1.794978858E12, 1297.0], [1.794978854E12, 875.0], [1.794978855E12, 1013.0], [1.794978856E12, 1143.0], [1.794978862E12, 1518.0], [1.794978863E12, 116.0], [1.794978859E12, 1221.0], [1.79497886E12, 1505.0], [1.794978861E12, 1427.0], [1.794978846E12, 1071.0], [1.794978847E12, 1077.0], [1.794978848E12, 1025.0], [1.794978843E12, 830.0], [1.794978844E12, 863.0], [1.794978845E12, 1065.0]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978863E12, "title": "Total Transactions Per Second"}},
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

