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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 24.0, "series": [{"data": [[0.0, 1.0], [0.1, 1.0], [0.2, 1.0], [0.3, 1.0], [0.4, 1.0], [0.5, 1.0], [0.6, 1.0], [0.7, 1.0], [0.8, 1.0], [0.9, 1.0], [1.0, 1.0], [1.1, 1.0], [1.2, 1.0], [1.3, 1.0], [1.4, 1.0], [1.5, 1.0], [1.6, 1.0], [1.7, 1.0], [1.8, 1.0], [1.9, 1.0], [2.0, 1.0], [2.1, 1.0], [2.2, 1.0], [2.3, 1.0], [2.4, 1.0], [2.5, 1.0], [2.6, 1.0], [2.7, 1.0], [2.8, 1.0], [2.9, 1.0], [3.0, 1.0], [3.1, 1.0], [3.2, 1.0], [3.3, 1.0], [3.4, 1.0], [3.5, 1.0], [3.6, 1.0], [3.7, 1.0], [3.8, 1.0], [3.9, 1.0], [4.0, 1.0], [4.1, 1.0], [4.2, 1.0], [4.3, 1.0], [4.4, 1.0], [4.5, 1.0], [4.6, 1.0], [4.7, 1.0], [4.8, 1.0], [4.9, 1.0], [5.0, 1.0], [5.1, 1.0], [5.2, 1.0], [5.3, 1.0], [5.4, 1.0], [5.5, 1.0], [5.6, 1.0], [5.7, 1.0], [5.8, 1.0], [5.9, 1.0], [6.0, 1.0], [6.1, 1.0], [6.2, 1.0], [6.3, 1.0], [6.4, 1.0], [6.5, 1.0], [6.6, 1.0], [6.7, 1.0], [6.8, 1.0], [6.9, 1.0], [7.0, 1.0], [7.1, 1.0], [7.2, 1.0], [7.3, 1.0], [7.4, 1.0], [7.5, 1.0], [7.6, 1.0], [7.7, 1.0], [7.8, 1.0], [7.9, 1.0], [8.0, 1.0], [8.1, 1.0], [8.2, 1.0], [8.3, 1.0], [8.4, 1.0], [8.5, 1.0], [8.6, 1.0], [8.7, 1.0], [8.8, 1.0], [8.9, 1.0], [9.0, 1.0], [9.1, 1.0], [9.2, 2.0], [9.3, 2.0], [9.4, 2.0], [9.5, 2.0], [9.6, 2.0], [9.7, 2.0], [9.8, 2.0], [9.9, 2.0], [10.0, 2.0], [10.1, 2.0], [10.2, 2.0], [10.3, 2.0], [10.4, 2.0], [10.5, 2.0], [10.6, 2.0], [10.7, 2.0], [10.8, 2.0], [10.9, 2.0], [11.0, 2.0], [11.1, 2.0], [11.2, 2.0], [11.3, 2.0], [11.4, 2.0], [11.5, 2.0], [11.6, 2.0], [11.7, 2.0], [11.8, 2.0], [11.9, 2.0], [12.0, 2.0], [12.1, 2.0], [12.2, 2.0], [12.3, 2.0], [12.4, 2.0], [12.5, 2.0], [12.6, 2.0], [12.7, 2.0], [12.8, 2.0], [12.9, 2.0], [13.0, 2.0], [13.1, 2.0], [13.2, 2.0], [13.3, 2.0], [13.4, 2.0], [13.5, 2.0], [13.6, 2.0], [13.7, 2.0], [13.8, 2.0], [13.9, 2.0], [14.0, 2.0], [14.1, 2.0], [14.2, 2.0], [14.3, 2.0], [14.4, 2.0], [14.5, 2.0], [14.6, 2.0], [14.7, 2.0], [14.8, 2.0], [14.9, 2.0], [15.0, 2.0], [15.1, 2.0], [15.2, 2.0], [15.3, 2.0], [15.4, 2.0], [15.5, 2.0], [15.6, 2.0], [15.7, 2.0], [15.8, 2.0], [15.9, 2.0], [16.0, 2.0], [16.1, 2.0], [16.2, 2.0], [16.3, 2.0], [16.4, 2.0], [16.5, 2.0], [16.6, 2.0], [16.7, 2.0], [16.8, 2.0], [16.9, 2.0], [17.0, 2.0], [17.1, 2.0], [17.2, 2.0], [17.3, 2.0], [17.4, 2.0], [17.5, 2.0], [17.6, 2.0], [17.7, 2.0], [17.8, 2.0], [17.9, 2.0], [18.0, 2.0], [18.1, 2.0], [18.2, 2.0], [18.3, 2.0], [18.4, 2.0], [18.5, 2.0], [18.6, 2.0], [18.7, 2.0], [18.8, 2.0], [18.9, 2.0], [19.0, 2.0], [19.1, 2.0], [19.2, 2.0], [19.3, 2.0], [19.4, 2.0], [19.5, 2.0], [19.6, 2.0], [19.7, 2.0], [19.8, 2.0], [19.9, 2.0], [20.0, 2.0], [20.1, 2.0], [20.2, 2.0], [20.3, 2.0], [20.4, 2.0], [20.5, 2.0], [20.6, 2.0], [20.7, 2.0], [20.8, 2.0], [20.9, 2.0], [21.0, 2.0], [21.1, 2.0], [21.2, 2.0], [21.3, 2.0], [21.4, 2.0], [21.5, 2.0], [21.6, 2.0], [21.7, 2.0], [21.8, 2.0], [21.9, 2.0], [22.0, 2.0], [22.1, 2.0], [22.2, 2.0], [22.3, 2.0], [22.4, 2.0], [22.5, 2.0], [22.6, 2.0], [22.7, 2.0], [22.8, 2.0], [22.9, 2.0], [23.0, 2.0], [23.1, 2.0], [23.2, 2.0], [23.3, 2.0], [23.4, 2.0], [23.5, 2.0], [23.6, 2.0], [23.7, 2.0], [23.8, 2.0], [23.9, 2.0], [24.0, 2.0], [24.1, 2.0], [24.2, 2.0], [24.3, 2.0], [24.4, 2.0], [24.5, 2.0], [24.6, 2.0], [24.7, 2.0], [24.8, 2.0], [24.9, 2.0], [25.0, 2.0], [25.1, 2.0], [25.2, 2.0], [25.3, 2.0], [25.4, 2.0], [25.5, 2.0], [25.6, 2.0], [25.7, 2.0], [25.8, 2.0], [25.9, 2.0], [26.0, 2.0], [26.1, 2.0], [26.2, 2.0], [26.3, 2.0], [26.4, 2.0], [26.5, 2.0], [26.6, 2.0], [26.7, 2.0], [26.8, 2.0], [26.9, 2.0], [27.0, 2.0], [27.1, 2.0], [27.2, 2.0], [27.3, 2.0], [27.4, 2.0], [27.5, 2.0], [27.6, 2.0], [27.7, 2.0], [27.8, 2.0], [27.9, 2.0], [28.0, 2.0], [28.1, 2.0], [28.2, 2.0], [28.3, 2.0], [28.4, 2.0], [28.5, 2.0], [28.6, 2.0], [28.7, 2.0], [28.8, 2.0], [28.9, 2.0], [29.0, 2.0], [29.1, 2.0], [29.2, 2.0], [29.3, 2.0], [29.4, 2.0], [29.5, 2.0], [29.6, 2.0], [29.7, 2.0], [29.8, 2.0], [29.9, 2.0], [30.0, 2.0], [30.1, 2.0], [30.2, 2.0], [30.3, 2.0], [30.4, 2.0], [30.5, 2.0], [30.6, 2.0], [30.7, 2.0], [30.8, 2.0], [30.9, 2.0], [31.0, 2.0], [31.1, 2.0], [31.2, 2.0], [31.3, 2.0], [31.4, 2.0], [31.5, 2.0], [31.6, 2.0], [31.7, 2.0], [31.8, 2.0], [31.9, 2.0], [32.0, 2.0], [32.1, 2.0], [32.2, 2.0], [32.3, 2.0], [32.4, 2.0], [32.5, 2.0], [32.6, 2.0], [32.7, 2.0], [32.8, 2.0], [32.9, 2.0], [33.0, 2.0], [33.1, 2.0], [33.2, 2.0], [33.3, 2.0], [33.4, 2.0], [33.5, 2.0], [33.6, 2.0], [33.7, 2.0], [33.8, 2.0], [33.9, 2.0], [34.0, 2.0], [34.1, 2.0], [34.2, 2.0], [34.3, 2.0], [34.4, 2.0], [34.5, 2.0], [34.6, 2.0], [34.7, 2.0], [34.8, 2.0], [34.9, 2.0], [35.0, 2.0], [35.1, 2.0], [35.2, 2.0], [35.3, 2.0], [35.4, 2.0], [35.5, 2.0], [35.6, 2.0], [35.7, 2.0], [35.8, 2.0], [35.9, 2.0], [36.0, 2.0], [36.1, 2.0], [36.2, 2.0], [36.3, 2.0], [36.4, 2.0], [36.5, 2.0], [36.6, 2.0], [36.7, 2.0], [36.8, 2.0], [36.9, 2.0], [37.0, 2.0], [37.1, 2.0], [37.2, 2.0], [37.3, 2.0], [37.4, 2.0], [37.5, 2.0], [37.6, 2.0], [37.7, 2.0], [37.8, 2.0], [37.9, 2.0], [38.0, 2.0], [38.1, 2.0], [38.2, 2.0], [38.3, 2.0], [38.4, 2.0], [38.5, 2.0], [38.6, 2.0], [38.7, 2.0], [38.8, 2.0], [38.9, 2.0], [39.0, 2.0], [39.1, 2.0], [39.2, 2.0], [39.3, 2.0], [39.4, 2.0], [39.5, 2.0], [39.6, 2.0], [39.7, 2.0], [39.8, 2.0], [39.9, 2.0], [40.0, 2.0], [40.1, 2.0], [40.2, 2.0], [40.3, 2.0], [40.4, 2.0], [40.5, 2.0], [40.6, 2.0], [40.7, 2.0], [40.8, 2.0], [40.9, 2.0], [41.0, 2.0], [41.1, 2.0], [41.2, 2.0], [41.3, 2.0], [41.4, 2.0], [41.5, 2.0], [41.6, 2.0], [41.7, 2.0], [41.8, 2.0], [41.9, 2.0], [42.0, 2.0], [42.1, 2.0], [42.2, 2.0], [42.3, 2.0], [42.4, 2.0], [42.5, 2.0], [42.6, 2.0], [42.7, 2.0], [42.8, 2.0], [42.9, 2.0], [43.0, 2.0], [43.1, 2.0], [43.2, 2.0], [43.3, 2.0], [43.4, 2.0], [43.5, 2.0], [43.6, 2.0], [43.7, 2.0], [43.8, 2.0], [43.9, 2.0], [44.0, 2.0], [44.1, 2.0], [44.2, 2.0], [44.3, 2.0], [44.4, 2.0], [44.5, 2.0], [44.6, 2.0], [44.7, 2.0], [44.8, 2.0], [44.9, 2.0], [45.0, 2.0], [45.1, 2.0], [45.2, 2.0], [45.3, 2.0], [45.4, 2.0], [45.5, 2.0], [45.6, 2.0], [45.7, 2.0], [45.8, 2.0], [45.9, 2.0], [46.0, 2.0], [46.1, 2.0], [46.2, 2.0], [46.3, 2.0], [46.4, 2.0], [46.5, 2.0], [46.6, 2.0], [46.7, 2.0], [46.8, 2.0], [46.9, 2.0], [47.0, 2.0], [47.1, 2.0], [47.2, 2.0], [47.3, 2.0], [47.4, 2.0], [47.5, 2.0], [47.6, 2.0], [47.7, 2.0], [47.8, 2.0], [47.9, 2.0], [48.0, 2.0], [48.1, 2.0], [48.2, 2.0], [48.3, 2.0], [48.4, 2.0], [48.5, 2.0], [48.6, 2.0], [48.7, 2.0], [48.8, 2.0], [48.9, 2.0], [49.0, 2.0], [49.1, 2.0], [49.2, 2.0], [49.3, 2.0], [49.4, 2.0], [49.5, 2.0], [49.6, 2.0], [49.7, 2.0], [49.8, 2.0], [49.9, 2.0], [50.0, 2.0], [50.1, 2.0], [50.2, 2.0], [50.3, 2.0], [50.4, 2.0], [50.5, 2.0], [50.6, 2.0], [50.7, 2.0], [50.8, 2.0], [50.9, 2.0], [51.0, 2.0], [51.1, 2.0], [51.2, 2.0], [51.3, 2.0], [51.4, 2.0], [51.5, 2.0], [51.6, 2.0], [51.7, 2.0], [51.8, 2.0], [51.9, 2.0], [52.0, 2.0], [52.1, 2.0], [52.2, 2.0], [52.3, 2.0], [52.4, 2.0], [52.5, 2.0], [52.6, 2.0], [52.7, 2.0], [52.8, 2.0], [52.9, 2.0], [53.0, 2.0], [53.1, 2.0], [53.2, 2.0], [53.3, 2.0], [53.4, 2.0], [53.5, 2.0], [53.6, 2.0], [53.7, 2.0], [53.8, 2.0], [53.9, 2.0], [54.0, 2.0], [54.1, 2.0], [54.2, 2.0], [54.3, 2.0], [54.4, 2.0], [54.5, 2.0], [54.6, 2.0], [54.7, 2.0], [54.8, 2.0], [54.9, 2.0], [55.0, 2.0], [55.1, 2.0], [55.2, 2.0], [55.3, 2.0], [55.4, 2.0], [55.5, 2.0], [55.6, 2.0], [55.7, 2.0], [55.8, 2.0], [55.9, 2.0], [56.0, 2.0], [56.1, 2.0], [56.2, 2.0], [56.3, 2.0], [56.4, 2.0], [56.5, 2.0], [56.6, 2.0], [56.7, 2.0], [56.8, 2.0], [56.9, 2.0], [57.0, 2.0], [57.1, 2.0], [57.2, 2.0], [57.3, 2.0], [57.4, 2.0], [57.5, 2.0], [57.6, 2.0], [57.7, 2.0], [57.8, 2.0], [57.9, 2.0], [58.0, 2.0], [58.1, 2.0], [58.2, 2.0], [58.3, 2.0], [58.4, 2.0], [58.5, 2.0], [58.6, 2.0], [58.7, 2.0], [58.8, 2.0], [58.9, 2.0], [59.0, 2.0], [59.1, 2.0], [59.2, 2.0], [59.3, 2.0], [59.4, 2.0], [59.5, 2.0], [59.6, 2.0], [59.7, 2.0], [59.8, 2.0], [59.9, 2.0], [60.0, 2.0], [60.1, 2.0], [60.2, 2.0], [60.3, 2.0], [60.4, 2.0], [60.5, 2.0], [60.6, 2.0], [60.7, 2.0], [60.8, 2.0], [60.9, 2.0], [61.0, 2.0], [61.1, 2.0], [61.2, 2.0], [61.3, 2.0], [61.4, 2.0], [61.5, 2.0], [61.6, 2.0], [61.7, 2.0], [61.8, 2.0], [61.9, 2.0], [62.0, 2.0], [62.1, 2.0], [62.2, 2.0], [62.3, 2.0], [62.4, 2.0], [62.5, 2.0], [62.6, 2.0], [62.7, 2.0], [62.8, 2.0], [62.9, 2.0], [63.0, 2.0], [63.1, 2.0], [63.2, 2.0], [63.3, 2.0], [63.4, 2.0], [63.5, 2.0], [63.6, 2.0], [63.7, 2.0], [63.8, 2.0], [63.9, 2.0], [64.0, 2.0], [64.1, 2.0], [64.2, 2.0], [64.3, 2.0], [64.4, 2.0], [64.5, 2.0], [64.6, 2.0], [64.7, 2.0], [64.8, 2.0], [64.9, 2.0], [65.0, 2.0], [65.1, 2.0], [65.2, 2.0], [65.3, 2.0], [65.4, 2.0], [65.5, 2.0], [65.6, 2.0], [65.7, 2.0], [65.8, 2.0], [65.9, 2.0], [66.0, 2.0], [66.1, 2.0], [66.2, 2.0], [66.3, 2.0], [66.4, 2.0], [66.5, 2.0], [66.6, 2.0], [66.7, 2.0], [66.8, 2.0], [66.9, 2.0], [67.0, 2.0], [67.1, 2.0], [67.2, 2.0], [67.3, 2.0], [67.4, 2.0], [67.5, 2.0], [67.6, 2.0], [67.7, 2.0], [67.8, 2.0], [67.9, 2.0], [68.0, 2.0], [68.1, 2.0], [68.2, 2.0], [68.3, 2.0], [68.4, 2.0], [68.5, 2.0], [68.6, 2.0], [68.7, 2.0], [68.8, 2.0], [68.9, 2.0], [69.0, 2.0], [69.1, 2.0], [69.2, 2.0], [69.3, 2.0], [69.4, 2.0], [69.5, 2.0], [69.6, 2.0], [69.7, 2.0], [69.8, 2.0], [69.9, 2.0], [70.0, 2.0], [70.1, 2.0], [70.2, 2.0], [70.3, 2.0], [70.4, 2.0], [70.5, 2.0], [70.6, 2.0], [70.7, 2.0], [70.8, 2.0], [70.9, 2.0], [71.0, 2.0], [71.1, 2.0], [71.2, 2.0], [71.3, 2.0], [71.4, 2.0], [71.5, 2.0], [71.6, 2.0], [71.7, 2.0], [71.8, 2.0], [71.9, 2.0], [72.0, 2.0], [72.1, 2.0], [72.2, 2.0], [72.3, 2.0], [72.4, 2.0], [72.5, 2.0], [72.6, 2.0], [72.7, 2.0], [72.8, 2.0], [72.9, 2.0], [73.0, 2.0], [73.1, 2.0], [73.2, 2.0], [73.3, 2.0], [73.4, 2.0], [73.5, 2.0], [73.6, 2.0], [73.7, 2.0], [73.8, 2.0], [73.9, 2.0], [74.0, 2.0], [74.1, 2.0], [74.2, 2.0], [74.3, 2.0], [74.4, 2.0], [74.5, 2.0], [74.6, 2.0], [74.7, 2.0], [74.8, 2.0], [74.9, 2.0], [75.0, 2.0], [75.1, 2.0], [75.2, 2.0], [75.3, 2.0], [75.4, 2.0], [75.5, 2.0], [75.6, 2.0], [75.7, 2.0], [75.8, 2.0], [75.9, 2.0], [76.0, 2.0], [76.1, 2.0], [76.2, 2.0], [76.3, 2.0], [76.4, 2.0], [76.5, 2.0], [76.6, 2.0], [76.7, 3.0], [76.8, 3.0], [76.9, 3.0], [77.0, 3.0], [77.1, 3.0], [77.2, 3.0], [77.3, 3.0], [77.4, 3.0], [77.5, 3.0], [77.6, 3.0], [77.7, 3.0], [77.8, 3.0], [77.9, 3.0], [78.0, 3.0], [78.1, 3.0], [78.2, 3.0], [78.3, 3.0], [78.4, 3.0], [78.5, 3.0], [78.6, 3.0], [78.7, 3.0], [78.8, 3.0], [78.9, 3.0], [79.0, 3.0], [79.1, 3.0], [79.2, 3.0], [79.3, 3.0], [79.4, 3.0], [79.5, 3.0], [79.6, 3.0], [79.7, 3.0], [79.8, 3.0], [79.9, 3.0], [80.0, 3.0], [80.1, 3.0], [80.2, 3.0], [80.3, 3.0], [80.4, 3.0], [80.5, 3.0], [80.6, 3.0], [80.7, 3.0], [80.8, 3.0], [80.9, 3.0], [81.0, 3.0], [81.1, 3.0], [81.2, 3.0], [81.3, 3.0], [81.4, 3.0], [81.5, 3.0], [81.6, 3.0], [81.7, 3.0], [81.8, 3.0], [81.9, 3.0], [82.0, 3.0], [82.1, 3.0], [82.2, 3.0], [82.3, 3.0], [82.4, 3.0], [82.5, 3.0], [82.6, 3.0], [82.7, 3.0], [82.8, 3.0], [82.9, 3.0], [83.0, 3.0], [83.1, 3.0], [83.2, 3.0], [83.3, 3.0], [83.4, 3.0], [83.5, 3.0], [83.6, 3.0], [83.7, 3.0], [83.8, 3.0], [83.9, 3.0], [84.0, 3.0], [84.1, 3.0], [84.2, 3.0], [84.3, 3.0], [84.4, 3.0], [84.5, 3.0], [84.6, 3.0], [84.7, 3.0], [84.8, 3.0], [84.9, 3.0], [85.0, 3.0], [85.1, 3.0], [85.2, 3.0], [85.3, 3.0], [85.4, 3.0], [85.5, 3.0], [85.6, 3.0], [85.7, 3.0], [85.8, 3.0], [85.9, 3.0], [86.0, 3.0], [86.1, 3.0], [86.2, 3.0], [86.3, 3.0], [86.4, 3.0], [86.5, 3.0], [86.6, 3.0], [86.7, 3.0], [86.8, 3.0], [86.9, 3.0], [87.0, 3.0], [87.1, 3.0], [87.2, 3.0], [87.3, 3.0], [87.4, 3.0], [87.5, 3.0], [87.6, 3.0], [87.7, 3.0], [87.8, 3.0], [87.9, 3.0], [88.0, 3.0], [88.1, 3.0], [88.2, 3.0], [88.3, 3.0], [88.4, 3.0], [88.5, 3.0], [88.6, 3.0], [88.7, 3.0], [88.8, 3.0], [88.9, 3.0], [89.0, 3.0], [89.1, 3.0], [89.2, 3.0], [89.3, 3.0], [89.4, 3.0], [89.5, 3.0], [89.6, 3.0], [89.7, 3.0], [89.8, 3.0], [89.9, 3.0], [90.0, 3.0], [90.1, 3.0], [90.2, 3.0], [90.3, 3.0], [90.4, 3.0], [90.5, 3.0], [90.6, 3.0], [90.7, 3.0], [90.8, 3.0], [90.9, 3.0], [91.0, 3.0], [91.1, 3.0], [91.2, 3.0], [91.3, 3.0], [91.4, 3.0], [91.5, 3.0], [91.6, 3.0], [91.7, 3.0], [91.8, 3.0], [91.9, 3.0], [92.0, 3.0], [92.1, 3.0], [92.2, 3.0], [92.3, 3.0], [92.4, 3.0], [92.5, 3.0], [92.6, 3.0], [92.7, 3.0], [92.8, 3.0], [92.9, 3.0], [93.0, 3.0], [93.1, 3.0], [93.2, 3.0], [93.3, 3.0], [93.4, 3.0], [93.5, 3.0], [93.6, 3.0], [93.7, 3.0], [93.8, 3.0], [93.9, 3.0], [94.0, 4.0], [94.1, 4.0], [94.2, 4.0], [94.3, 4.0], [94.4, 4.0], [94.5, 4.0], [94.6, 4.0], [94.7, 4.0], [94.8, 4.0], [94.9, 4.0], [95.0, 4.0], [95.1, 4.0], [95.2, 4.0], [95.3, 4.0], [95.4, 4.0], [95.5, 4.0], [95.6, 4.0], [95.7, 4.0], [95.8, 4.0], [95.9, 4.0], [96.0, 4.0], [96.1, 4.0], [96.2, 4.0], [96.3, 4.0], [96.4, 4.0], [96.5, 4.0], [96.6, 4.0], [96.7, 4.0], [96.8, 4.0], [96.9, 4.0], [97.0, 4.0], [97.1, 4.0], [97.2, 5.0], [97.3, 5.0], [97.4, 5.0], [97.5, 5.0], [97.6, 5.0], [97.7, 5.0], [97.8, 5.0], [97.9, 5.0], [98.0, 5.0], [98.1, 5.0], [98.2, 5.0], [98.3, 5.0], [98.4, 6.0], [98.5, 6.0], [98.6, 6.0], [98.7, 6.0], [98.8, 6.0], [98.9, 7.0], [99.0, 7.0], [99.1, 7.0], [99.2, 8.0], [99.3, 8.0], [99.4, 9.0], [99.5, 9.0], [99.6, 10.0], [99.7, 11.0], [99.8, 13.0], [99.9, 16.0]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 22954.0, "minX": 0.0, "maxY": 22954.0, "series": [{"data": [[0.0, 22954.0]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 4.9E-324, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 22954.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 22954.0, "series": [{"data": [[0.0, 22954.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 4.9E-324, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 1.0049504950495052, "minX": 1.794978517E12, "maxY": 1.1412429378531077, "series": [{"data": [[1.794978532E12, 1.0891089108910887], [1.794978531E12, 1.0794223826714806], [1.794978533E12, 1.0800000000000005], [1.794978529E12, 1.0610328638497646], [1.79497853E12, 1.0608695652173916], [1.794978537E12, 1.0422535211267607], [1.794978517E12, 1.0243902439024393], [1.794978534E12, 1.0827814569536436], [1.794978536E12, 1.0612244897959182], [1.794978535E12, 1.114982578397212], [1.794978521E12, 1.0276243093922652], [1.794978522E12, 1.019900497512438], [1.794978518E12, 1.0726256983240228], [1.79497852E12, 1.1022727272727275], [1.794978519E12, 1.015873015873016], [1.794978526E12, 1.0490196078431375], [1.794978528E12, 1.0730593607305947], [1.794978527E12, 1.0101010101010108], [1.794978524E12, 1.0169491525423726], [1.794978523E12, 1.0355329949238579], [1.794978525E12, 1.02439024390244]], "isOverall": false, "label": "One request group 5", "isController": false}, {"data": [[1.794978532E12, 1.0797342192691026], [1.794978531E12, 1.0690909090909082], [1.794978533E12, 1.0993377483443714], [1.794978529E12, 1.0284360189573465], [1.79497853E12, 1.091703056768559], [1.794978537E12, 1.042253521126761], [1.794978517E12, 1.0250000000000004], [1.794978534E12, 1.087248322147651], [1.794978536E12, 1.061855670103093], [1.794978535E12, 1.0909090909090915], [1.794978521E12, 1.0110497237569065], [1.794978522E12, 1.0248756218905473], [1.794978518E12, 1.057142857142856], [1.79497852E12, 1.1129943502824855], [1.794978519E12, 1.0052910052910058], [1.794978526E12, 1.0197044334975374], [1.794978528E12, 1.0843881856540085], [1.794978527E12, 1.0050000000000003], [1.794978524E12, 1.005617977528091], [1.794978523E12, 1.0510204081632648], [1.794978525E12, 1.0436893203883488]], "isOverall": false, "label": "One request group 4", "isController": false}, {"data": [[1.794978532E12, 1.0894039735099335], [1.794978531E12, 1.0652173913043477], [1.794978533E12, 1.10891089108911], [1.794978529E12, 1.0469483568075122], [1.79497853E12, 1.0748898678414096], [1.794978537E12, 1.0422535211267612], [1.794978517E12, 1.0952380952380951], [1.794978534E12, 1.0999999999999999], [1.794978536E12, 1.0753424657534247], [1.794978535E12, 1.0940766550522651], [1.794978521E12, 1.0111111111111115], [1.794978522E12, 1.01980198019802], [1.794978518E12, 1.0852272727272727], [1.79497852E12, 1.1142857142857145], [1.794978519E12, 1.0053191489361708], [1.794978526E12, 1.0490196078431377], [1.794978528E12, 1.0655021834061138], [1.794978527E12, 1.025], [1.794978524E12, 1.0112359550561807], [1.794978523E12, 1.0353535353535348], [1.794978525E12, 1.0239234449760772]], "isOverall": false, "label": "One request group 1", "isController": false}, {"data": [[1.794978532E12, 1.0730897009966776], [1.794978531E12, 1.0543478260869572], [1.794978533E12, 1.0986842105263157], [1.794978529E12, 1.0471698113207546], [1.79497853E12, 1.0735930735930737], [1.794978537E12, 1.0330188679245282], [1.794978517E12, 1.0238095238095237], [1.794978534E12, 1.1229235880398671], [1.794978536E12, 1.0745762711864415], [1.794978535E12, 1.0944055944055946], [1.794978521E12, 1.0055555555555562], [1.794978522E12, 1.0049504950495052], [1.794978518E12, 1.090395480225989], [1.79497852E12, 1.1412429378531077], [1.794978519E12, 1.0366492146596862], [1.794978526E12, 1.068627450980392], [1.794978528E12, 1.0803571428571435], [1.794978527E12, 1.0101010101010108], [1.794978524E12, 1.0224719101123596], [1.794978523E12, 1.0456852791878177], [1.794978525E12, 1.029126213592233]], "isOverall": false, "label": "One request group 3", "isController": false}, {"data": [[1.794978532E12, 1.092105263157896], [1.794978531E12, 1.0581818181818197], [1.794978533E12, 1.0900000000000005], [1.794978529E12, 1.0471698113207548], [1.79497853E12, 1.069868995633188], [1.794978537E12, 1.0469483568075122], [1.794978517E12, 1.0731707317073171], [1.794978534E12, 1.0933333333333333], [1.794978536E12, 1.0813559322033892], [1.794978535E12, 1.0979020979020977], [1.794978521E12, 1.027624309392266], [1.794978522E12, 1.009950248756219], [1.794978518E12, 1.0734463276836164], [1.79497852E12, 1.1142857142857143], [1.794978519E12, 1.0212765957446814], [1.794978526E12, 1.0439024390243905], [1.794978528E12, 1.047619047619048], [1.794978527E12, 1.0151515151515156], [1.794978524E12, 1.005617977528091], [1.794978523E12, 1.0306122448979596], [1.794978525E12, 1.0291262135922332]], "isOverall": false, "label": "One request group 2", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978537E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 2.0771144278606997, "minX": 1.0, "maxY": 18.0, "series": [{"data": [[2.0, 2.191877895884437], [3.0, 2.210613256246133], [4.0, 2.126551668547476], [5.0, 2.135312873654844], [6.0, 3.5352697095435683], [7.0, 4.154929577464791], [8.0, 4.285714285714284], [9.0, 5.123595505617975], [10.0, 6.354166666666666], [11.0, 7.891891891891894], [12.0, 7.692307692307692], [13.0, 7.964285714285716], [14.0, 9.894736842105265], [15.0, 9.125], [1.0, 2.0771144278606997], [16.0, 11.1], [17.0, 12.4], [18.0, 11.833333333333334], [19.0, 10.2], [20.0, 10.5], [21.0, 15.5], [22.0, 15.0], [23.0, 16.75], [25.0, 18.0], [26.0, 11.0], [28.0, 13.0], [30.0, 14.5]], "isOverall": false, "label": "write", "isController": false}, {"data": [[3.6406290842554623, 2.2963317940228514]], "isOverall": false, "label": "write-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 30.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 121334.0, "minX": 1.794978517E12, "maxY": 921710.0, "series": [{"data": [[1.794978532E12, 921710.0], [1.794978531E12, 841190.0], [1.794978533E12, 920490.0], [1.794978529E12, 647210.0], [1.79497853E12, 699060.0], [1.794978537E12, 649040.0], [1.794978517E12, 125660.0], [1.794978534E12, 915610.0], [1.794978536E12, 894870.0], [1.794978535E12, 873520.0], [1.794978521E12, 550830.0], [1.794978522E12, 614270.0], [1.794978518E12, 539240.0], [1.79497852E12, 536800.0], [1.794978519E12, 576450.0], [1.794978526E12, 622200.0], [1.794978528E12, 695400.0], [1.794978527E12, 606340.0], [1.794978524E12, 542290.0], [1.794978523E12, 600240.0], [1.794978525E12, 629520.0]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.794978532E12, 889979.0], [1.794978531E12, 812231.0], [1.794978533E12, 888801.0], [1.794978529E12, 624929.0], [1.79497853E12, 674994.0], [1.794978537E12, 626696.0], [1.794978517E12, 121334.0], [1.794978534E12, 884089.0], [1.794978536E12, 864063.0], [1.794978535E12, 843448.0], [1.794978521E12, 531867.0], [1.794978522E12, 593123.0], [1.794978518E12, 520676.0], [1.79497852E12, 518320.0], [1.794978519E12, 556605.0], [1.794978526E12, 600780.0], [1.794978528E12, 671460.0], [1.794978527E12, 585466.0], [1.794978524E12, 523621.0], [1.794978523E12, 579576.0], [1.794978525E12, 607848.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978537E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 2.102733270499525, "minX": 1.794978517E12, "maxY": 2.735294117647061, "series": [{"data": [[1.794978532E12, 2.2753143613500972], [1.794978531E12, 2.2632342277012354], [1.794978533E12, 2.3605036447978853], [1.794978529E12, 2.102733270499525], [1.79497853E12, 2.2460732984293252], [1.794978537E12, 2.1569548872180437], [1.794978517E12, 2.3932038834951452], [1.794978534E12, 2.335109926715522], [1.794978536E12, 2.2917518745739587], [1.794978535E12, 2.366620111731844], [1.794978521E12, 2.2093023255813975], [1.794978522E12, 2.145978152929491], [1.794978518E12, 2.735294117647061], [1.79497852E12, 2.6556818181818183], [1.794978519E12, 2.1862433862433863], [1.794978526E12, 2.299019607843133], [1.794978528E12, 2.2956140350877225], [1.794978527E12, 2.160965794768612], [1.794978524E12, 2.208098987626543], [1.794978523E12, 2.2794715447154488], [1.794978525E12, 2.3711240310077515]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978537E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 2.0942507068802994, "minX": 1.794978517E12, "maxY": 2.718325791855202, "series": [{"data": [[1.794978532E12, 2.2680344142951645], [1.794978531E12, 2.2559825960841184], [1.794978533E12, 2.35520212060967], [1.794978529E12, 2.0942507068802994], [1.79497853E12, 2.2390924956370006], [1.794978537E12, 2.1531954887218037], [1.794978517E12, 2.383495145631067], [1.794978534E12, 2.325116588940702], [1.794978536E12, 2.2876618950238643], [1.794978535E12, 2.3568435754189925], [1.794978521E12, 2.2059800664451843], [1.794978522E12, 2.1420059582919566], [1.794978518E12, 2.718325791855202], [1.79497852E12, 2.644318181818182], [1.794978519E12, 2.180952380952382], [1.794978526E12, 2.2882352941176447], [1.794978528E12, 2.290350877192985], [1.794978527E12, 2.1498993963782693], [1.794978524E12, 2.2013498312710915], [1.794978523E12, 2.27439024390244], [1.794978525E12, 2.366279069767445]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978537E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.17801047120418856, "minX": 1.794978517E12, "maxY": 0.23068783068783083, "series": [{"data": [[1.794978532E12, 0.18795499669093332], [1.794978531E12, 0.20087019579405363], [1.794978533E12, 0.19946984758117944], [1.794978529E12, 0.18567389255419417], [1.79497853E12, 0.17801047120418856], [1.794978537E12, 0.19266917293233093], [1.794978517E12, 0.1893203883495145], [1.794978534E12, 0.19120586275816095], [1.794978536E12, 0.1935923653715065], [1.794978535E12, 0.19972067039106142], [1.794978521E12, 0.19158361018826103], [1.794978522E12, 0.20258192651439913], [1.794978518E12, 0.2228506787330317], [1.79497852E12, 0.21704545454545449], [1.794978519E12, 0.23068783068783083], [1.794978526E12, 0.19411764705882348], [1.794978528E12, 0.2122807017543859], [1.794978527E12, 0.22535211267605634], [1.794978524E12, 0.22384701912260965], [1.794978523E12, 0.2286585365853659], [1.794978525E12, 0.2296511627906976]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978537E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 1.0, "minX": 1.794978517E12, "maxY": 24.0, "series": [{"data": [[1.794978532E12, 10.0], [1.794978531E12, 13.0], [1.794978533E12, 11.0], [1.794978529E12, 8.0], [1.79497853E12, 12.0], [1.794978537E12, 5.0], [1.794978517E12, 10.0], [1.794978534E12, 11.0], [1.794978536E12, 11.0], [1.794978535E12, 19.0], [1.794978521E12, 9.0], [1.794978522E12, 8.0], [1.794978518E12, 24.0], [1.79497852E12, 21.0], [1.794978519E12, 15.0], [1.794978526E12, 12.0], [1.794978528E12, 17.0], [1.794978527E12, 9.0], [1.794978524E12, 9.0], [1.794978523E12, 11.0], [1.794978525E12, 12.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.794978532E12, 1.0], [1.794978531E12, 1.0], [1.794978533E12, 1.0], [1.794978529E12, 1.0], [1.79497853E12, 1.0], [1.794978537E12, 1.0], [1.794978517E12, 1.0], [1.794978534E12, 1.0], [1.794978536E12, 1.0], [1.794978535E12, 1.0], [1.794978521E12, 1.0], [1.794978522E12, 1.0], [1.794978518E12, 1.0], [1.79497852E12, 1.0], [1.794978519E12, 1.0], [1.794978526E12, 1.0], [1.794978528E12, 1.0], [1.794978527E12, 1.0], [1.794978524E12, 1.0], [1.794978523E12, 1.0], [1.794978525E12, 1.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.794978532E12, 3.0], [1.794978531E12, 3.0], [1.794978533E12, 3.0], [1.794978529E12, 3.0], [1.79497853E12, 3.0], [1.794978537E12, 3.0], [1.794978517E12, 3.0], [1.794978534E12, 3.0], [1.794978536E12, 3.0], [1.794978535E12, 3.0], [1.794978521E12, 3.0], [1.794978522E12, 3.0], [1.794978518E12, 4.0], [1.79497852E12, 3.0], [1.794978519E12, 3.0], [1.794978526E12, 3.0], [1.794978528E12, 3.0], [1.794978527E12, 3.0], [1.794978524E12, 3.0], [1.794978523E12, 3.0], [1.794978525E12, 3.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.794978532E12, 6.879999999999882], [1.794978531E12, 6.0], [1.794978533E12, 7.0], [1.794978529E12, 5.0], [1.79497853E12, 8.0], [1.794978537E12, 5.0], [1.794978517E12, 9.720000000000027], [1.794978534E12, 8.0], [1.794978536E12, 6.0], [1.794978535E12, 11.0], [1.794978521E12, 5.0], [1.794978522E12, 4.0], [1.794978518E12, 16.299999999999955], [1.79497852E12, 17.18999999999994], [1.794978519E12, 6.0], [1.794978526E12, 7.789999999999964], [1.794978528E12, 10.0], [1.794978527E12, 5.0], [1.794978524E12, 5.0], [1.794978523E12, 6.0], [1.794978525E12, 6.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.794978532E12, 2.0], [1.794978531E12, 2.0], [1.794978533E12, 2.0], [1.794978529E12, 2.0], [1.79497853E12, 2.0], [1.794978537E12, 2.0], [1.794978517E12, 2.0], [1.794978534E12, 2.0], [1.794978536E12, 2.0], [1.794978535E12, 2.0], [1.794978521E12, 2.0], [1.794978522E12, 2.0], [1.794978518E12, 2.0], [1.79497852E12, 2.0], [1.794978519E12, 2.0], [1.794978526E12, 2.0], [1.794978528E12, 2.0], [1.794978527E12, 2.0], [1.794978524E12, 2.0], [1.794978523E12, 2.0], [1.794978525E12, 2.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.794978532E12, 4.0], [1.794978531E12, 4.0], [1.794978533E12, 4.0], [1.794978529E12, 3.0], [1.79497853E12, 4.0], [1.794978537E12, 3.0], [1.794978517E12, 4.0], [1.794978534E12, 4.0], [1.794978536E12, 4.0], [1.794978535E12, 4.0], [1.794978521E12, 3.0], [1.794978522E12, 3.0], [1.794978518E12, 5.0], [1.79497852E12, 5.0], [1.794978519E12, 3.0], [1.794978526E12, 4.0], [1.794978528E12, 4.0], [1.794978527E12, 3.0], [1.794978524E12, 3.0], [1.794978523E12, 4.0], [1.794978525E12, 4.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978537E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 2.0, "minX": 206.0, "maxY": 2.0, "series": [{"data": [[206.0, 2.0], [884.0, 2.0], [880.0, 2.0], [889.0, 2.0], [903.0, 2.0], [945.0, 2.0], [984.0, 2.0], [1007.0, 2.0], [1020.0, 2.0], [994.0, 2.0], [1032.0, 2.0], [1061.0, 2.0], [1064.0, 2.0], [1140.0, 2.0], [1146.0, 2.0], [1379.0, 2.0], [1432.0, 2.0], [1467.0, 2.0], [1511.0, 2.0], [1509.0, 2.0], [1501.0, 2.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1511.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 2.0, "minX": 206.0, "maxY": 2.0, "series": [{"data": [[206.0, 2.0], [884.0, 2.0], [880.0, 2.0], [889.0, 2.0], [903.0, 2.0], [945.0, 2.0], [984.0, 2.0], [1007.0, 2.0], [1020.0, 2.0], [994.0, 2.0], [1032.0, 2.0], [1061.0, 2.0], [1064.0, 2.0], [1140.0, 2.0], [1146.0, 2.0], [1379.0, 2.0], [1432.0, 2.0], [1467.0, 2.0], [1511.0, 2.0], [1509.0, 2.0], [1501.0, 2.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1511.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 211.0, "minX": 1.794978517E12, "maxY": 1512.0, "series": [{"data": [[1.794978532E12, 1512.0], [1.794978531E12, 1382.0], [1.794978533E12, 1510.0], [1.794978529E12, 1060.0], [1.79497853E12, 1143.0], [1.794978537E12, 1060.0], [1.794978517E12, 211.0], [1.794978534E12, 1501.0], [1.794978536E12, 1469.0], [1.794978535E12, 1429.0], [1.794978521E12, 899.0], [1.794978522E12, 1006.0], [1.794978518E12, 882.0], [1.79497852E12, 884.0], [1.794978519E12, 943.0], [1.794978526E12, 1024.0], [1.794978528E12, 1142.0], [1.794978527E12, 991.0], [1.794978524E12, 892.0], [1.794978523E12, 985.0], [1.794978525E12, 1029.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978537E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 206.0, "minX": 1.794978517E12, "maxY": 1511.0, "series": [{"data": [[1.794978532E12, 1511.0], [1.794978531E12, 1379.0], [1.794978533E12, 1509.0], [1.794978529E12, 1061.0], [1.79497853E12, 1146.0], [1.794978537E12, 1064.0], [1.794978517E12, 206.0], [1.794978534E12, 1501.0], [1.794978536E12, 1467.0], [1.794978535E12, 1432.0], [1.794978521E12, 903.0], [1.794978522E12, 1007.0], [1.794978518E12, 884.0], [1.79497852E12, 880.0], [1.794978519E12, 945.0], [1.794978526E12, 1020.0], [1.794978528E12, 1140.0], [1.794978527E12, 994.0], [1.794978524E12, 889.0], [1.794978523E12, 984.0], [1.794978525E12, 1032.0]], "isOverall": false, "label": "201", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794978537E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 206.0, "minX": 1.794978517E12, "maxY": 1511.0, "series": [{"data": [[1.794978532E12, 1511.0], [1.794978531E12, 1379.0], [1.794978533E12, 1509.0], [1.794978529E12, 1061.0], [1.79497853E12, 1146.0], [1.794978537E12, 1064.0], [1.794978517E12, 206.0], [1.794978534E12, 1501.0], [1.794978536E12, 1467.0], [1.794978535E12, 1432.0], [1.794978521E12, 903.0], [1.794978522E12, 1007.0], [1.794978518E12, 884.0], [1.79497852E12, 880.0], [1.794978519E12, 945.0], [1.794978526E12, 1020.0], [1.794978528E12, 1140.0], [1.794978527E12, 994.0], [1.794978524E12, 889.0], [1.794978523E12, 984.0], [1.794978525E12, 1032.0]], "isOverall": false, "label": "write-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978537E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 206.0, "minX": 1.794978517E12, "maxY": 1511.0, "series": [{"data": [[1.794978532E12, 1511.0], [1.794978531E12, 1379.0], [1.794978533E12, 1509.0], [1.794978529E12, 1061.0], [1.79497853E12, 1146.0], [1.794978537E12, 1064.0], [1.794978517E12, 206.0], [1.794978534E12, 1501.0], [1.794978536E12, 1467.0], [1.794978535E12, 1432.0], [1.794978521E12, 903.0], [1.794978522E12, 1007.0], [1.794978518E12, 884.0], [1.79497852E12, 880.0], [1.794978519E12, 945.0], [1.794978526E12, 1020.0], [1.794978528E12, 1140.0], [1.794978527E12, 994.0], [1.794978524E12, 889.0], [1.794978523E12, 984.0], [1.794978525E12, 1032.0]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794978537E12, "title": "Total Transactions Per Second"}},
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

