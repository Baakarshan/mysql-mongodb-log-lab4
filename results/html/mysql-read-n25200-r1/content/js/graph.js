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
        data: {"result": {"minY": 2.0, "minX": 0.0, "maxY": 28.0, "series": [{"data": [[0.0, 2.0], [0.1, 2.0], [0.2, 2.0], [0.3, 2.0], [0.4, 2.0], [0.5, 2.0], [0.6, 2.0], [0.7, 2.0], [0.8, 2.0], [0.9, 2.0], [1.0, 2.0], [1.1, 2.0], [1.2, 2.0], [1.3, 2.0], [1.4, 3.0], [1.5, 3.0], [1.6, 3.0], [1.7, 3.0], [1.8, 3.0], [1.9, 3.0], [2.0, 3.0], [2.1, 3.0], [2.2, 3.0], [2.3, 3.0], [2.4, 3.0], [2.5, 3.0], [2.6, 3.0], [2.7, 3.0], [2.8, 3.0], [2.9, 3.0], [3.0, 3.0], [3.1, 3.0], [3.2, 3.0], [3.3, 3.0], [3.4, 3.0], [3.5, 3.0], [3.6, 3.0], [3.7, 3.0], [3.8, 3.0], [3.9, 3.0], [4.0, 3.0], [4.1, 3.0], [4.2, 3.0], [4.3, 3.0], [4.4, 3.0], [4.5, 3.0], [4.6, 3.0], [4.7, 3.0], [4.8, 3.0], [4.9, 3.0], [5.0, 3.0], [5.1, 3.0], [5.2, 3.0], [5.3, 3.0], [5.4, 3.0], [5.5, 3.0], [5.6, 3.0], [5.7, 3.0], [5.8, 3.0], [5.9, 3.0], [6.0, 3.0], [6.1, 3.0], [6.2, 3.0], [6.3, 3.0], [6.4, 3.0], [6.5, 3.0], [6.6, 3.0], [6.7, 3.0], [6.8, 3.0], [6.9, 3.0], [7.0, 3.0], [7.1, 3.0], [7.2, 3.0], [7.3, 3.0], [7.4, 3.0], [7.5, 3.0], [7.6, 3.0], [7.7, 3.0], [7.8, 3.0], [7.9, 3.0], [8.0, 3.0], [8.1, 3.0], [8.2, 3.0], [8.3, 3.0], [8.4, 3.0], [8.5, 3.0], [8.6, 3.0], [8.7, 3.0], [8.8, 3.0], [8.9, 3.0], [9.0, 3.0], [9.1, 3.0], [9.2, 3.0], [9.3, 3.0], [9.4, 3.0], [9.5, 3.0], [9.6, 3.0], [9.7, 3.0], [9.8, 3.0], [9.9, 3.0], [10.0, 3.0], [10.1, 3.0], [10.2, 3.0], [10.3, 3.0], [10.4, 3.0], [10.5, 3.0], [10.6, 3.0], [10.7, 3.0], [10.8, 3.0], [10.9, 3.0], [11.0, 3.0], [11.1, 3.0], [11.2, 3.0], [11.3, 3.0], [11.4, 3.0], [11.5, 3.0], [11.6, 3.0], [11.7, 3.0], [11.8, 3.0], [11.9, 3.0], [12.0, 3.0], [12.1, 3.0], [12.2, 3.0], [12.3, 3.0], [12.4, 3.0], [12.5, 3.0], [12.6, 3.0], [12.7, 3.0], [12.8, 3.0], [12.9, 3.0], [13.0, 3.0], [13.1, 3.0], [13.2, 3.0], [13.3, 3.0], [13.4, 3.0], [13.5, 3.0], [13.6, 3.0], [13.7, 3.0], [13.8, 3.0], [13.9, 3.0], [14.0, 3.0], [14.1, 3.0], [14.2, 3.0], [14.3, 3.0], [14.4, 3.0], [14.5, 3.0], [14.6, 3.0], [14.7, 3.0], [14.8, 3.0], [14.9, 3.0], [15.0, 3.0], [15.1, 3.0], [15.2, 3.0], [15.3, 3.0], [15.4, 3.0], [15.5, 3.0], [15.6, 3.0], [15.7, 3.0], [15.8, 3.0], [15.9, 3.0], [16.0, 3.0], [16.1, 3.0], [16.2, 3.0], [16.3, 3.0], [16.4, 3.0], [16.5, 3.0], [16.6, 3.0], [16.7, 3.0], [16.8, 3.0], [16.9, 3.0], [17.0, 3.0], [17.1, 3.0], [17.2, 3.0], [17.3, 3.0], [17.4, 3.0], [17.5, 3.0], [17.6, 3.0], [17.7, 3.0], [17.8, 3.0], [17.9, 3.0], [18.0, 3.0], [18.1, 3.0], [18.2, 3.0], [18.3, 3.0], [18.4, 3.0], [18.5, 3.0], [18.6, 3.0], [18.7, 3.0], [18.8, 3.0], [18.9, 3.0], [19.0, 3.0], [19.1, 3.0], [19.2, 3.0], [19.3, 3.0], [19.4, 3.0], [19.5, 3.0], [19.6, 3.0], [19.7, 3.0], [19.8, 3.0], [19.9, 3.0], [20.0, 3.0], [20.1, 3.0], [20.2, 3.0], [20.3, 3.0], [20.4, 3.0], [20.5, 3.0], [20.6, 3.0], [20.7, 3.0], [20.8, 3.0], [20.9, 3.0], [21.0, 3.0], [21.1, 3.0], [21.2, 3.0], [21.3, 3.0], [21.4, 3.0], [21.5, 3.0], [21.6, 3.0], [21.7, 3.0], [21.8, 3.0], [21.9, 3.0], [22.0, 3.0], [22.1, 3.0], [22.2, 3.0], [22.3, 3.0], [22.4, 3.0], [22.5, 3.0], [22.6, 3.0], [22.7, 3.0], [22.8, 3.0], [22.9, 3.0], [23.0, 3.0], [23.1, 3.0], [23.2, 3.0], [23.3, 3.0], [23.4, 3.0], [23.5, 3.0], [23.6, 3.0], [23.7, 3.0], [23.8, 3.0], [23.9, 3.0], [24.0, 3.0], [24.1, 3.0], [24.2, 3.0], [24.3, 3.0], [24.4, 3.0], [24.5, 3.0], [24.6, 3.0], [24.7, 3.0], [24.8, 3.0], [24.9, 3.0], [25.0, 3.0], [25.1, 3.0], [25.2, 3.0], [25.3, 3.0], [25.4, 3.0], [25.5, 3.0], [25.6, 3.0], [25.7, 3.0], [25.8, 3.0], [25.9, 3.0], [26.0, 3.0], [26.1, 3.0], [26.2, 3.0], [26.3, 3.0], [26.4, 3.0], [26.5, 3.0], [26.6, 3.0], [26.7, 3.0], [26.8, 3.0], [26.9, 3.0], [27.0, 3.0], [27.1, 3.0], [27.2, 3.0], [27.3, 3.0], [27.4, 3.0], [27.5, 3.0], [27.6, 3.0], [27.7, 3.0], [27.8, 3.0], [27.9, 3.0], [28.0, 3.0], [28.1, 3.0], [28.2, 3.0], [28.3, 3.0], [28.4, 3.0], [28.5, 3.0], [28.6, 3.0], [28.7, 3.0], [28.8, 3.0], [28.9, 3.0], [29.0, 3.0], [29.1, 3.0], [29.2, 3.0], [29.3, 3.0], [29.4, 3.0], [29.5, 3.0], [29.6, 3.0], [29.7, 3.0], [29.8, 3.0], [29.9, 3.0], [30.0, 3.0], [30.1, 3.0], [30.2, 3.0], [30.3, 3.0], [30.4, 3.0], [30.5, 3.0], [30.6, 3.0], [30.7, 3.0], [30.8, 3.0], [30.9, 3.0], [31.0, 3.0], [31.1, 3.0], [31.2, 3.0], [31.3, 3.0], [31.4, 3.0], [31.5, 3.0], [31.6, 3.0], [31.7, 3.0], [31.8, 3.0], [31.9, 3.0], [32.0, 3.0], [32.1, 3.0], [32.2, 3.0], [32.3, 3.0], [32.4, 3.0], [32.5, 3.0], [32.6, 3.0], [32.7, 3.0], [32.8, 3.0], [32.9, 3.0], [33.0, 3.0], [33.1, 3.0], [33.2, 3.0], [33.3, 3.0], [33.4, 3.0], [33.5, 3.0], [33.6, 3.0], [33.7, 3.0], [33.8, 3.0], [33.9, 3.0], [34.0, 3.0], [34.1, 3.0], [34.2, 3.0], [34.3, 3.0], [34.4, 3.0], [34.5, 3.0], [34.6, 3.0], [34.7, 3.0], [34.8, 3.0], [34.9, 3.0], [35.0, 3.0], [35.1, 3.0], [35.2, 3.0], [35.3, 3.0], [35.4, 3.0], [35.5, 3.0], [35.6, 3.0], [35.7, 3.0], [35.8, 3.0], [35.9, 3.0], [36.0, 3.0], [36.1, 3.0], [36.2, 3.0], [36.3, 3.0], [36.4, 3.0], [36.5, 3.0], [36.6, 3.0], [36.7, 3.0], [36.8, 3.0], [36.9, 3.0], [37.0, 3.0], [37.1, 3.0], [37.2, 3.0], [37.3, 3.0], [37.4, 4.0], [37.5, 4.0], [37.6, 4.0], [37.7, 4.0], [37.8, 4.0], [37.9, 4.0], [38.0, 4.0], [38.1, 4.0], [38.2, 4.0], [38.3, 4.0], [38.4, 4.0], [38.5, 4.0], [38.6, 4.0], [38.7, 4.0], [38.8, 4.0], [38.9, 4.0], [39.0, 4.0], [39.1, 4.0], [39.2, 4.0], [39.3, 4.0], [39.4, 4.0], [39.5, 4.0], [39.6, 4.0], [39.7, 4.0], [39.8, 4.0], [39.9, 4.0], [40.0, 4.0], [40.1, 4.0], [40.2, 4.0], [40.3, 4.0], [40.4, 4.0], [40.5, 4.0], [40.6, 4.0], [40.7, 4.0], [40.8, 4.0], [40.9, 4.0], [41.0, 4.0], [41.1, 4.0], [41.2, 4.0], [41.3, 4.0], [41.4, 4.0], [41.5, 4.0], [41.6, 4.0], [41.7, 4.0], [41.8, 4.0], [41.9, 4.0], [42.0, 4.0], [42.1, 4.0], [42.2, 4.0], [42.3, 4.0], [42.4, 4.0], [42.5, 4.0], [42.6, 4.0], [42.7, 4.0], [42.8, 4.0], [42.9, 4.0], [43.0, 4.0], [43.1, 4.0], [43.2, 4.0], [43.3, 4.0], [43.4, 4.0], [43.5, 4.0], [43.6, 4.0], [43.7, 4.0], [43.8, 4.0], [43.9, 4.0], [44.0, 4.0], [44.1, 4.0], [44.2, 4.0], [44.3, 4.0], [44.4, 4.0], [44.5, 4.0], [44.6, 4.0], [44.7, 4.0], [44.8, 4.0], [44.9, 4.0], [45.0, 4.0], [45.1, 4.0], [45.2, 4.0], [45.3, 4.0], [45.4, 4.0], [45.5, 4.0], [45.6, 4.0], [45.7, 4.0], [45.8, 4.0], [45.9, 4.0], [46.0, 4.0], [46.1, 4.0], [46.2, 4.0], [46.3, 4.0], [46.4, 4.0], [46.5, 4.0], [46.6, 4.0], [46.7, 4.0], [46.8, 4.0], [46.9, 4.0], [47.0, 4.0], [47.1, 4.0], [47.2, 4.0], [47.3, 4.0], [47.4, 4.0], [47.5, 4.0], [47.6, 4.0], [47.7, 4.0], [47.8, 4.0], [47.9, 4.0], [48.0, 4.0], [48.1, 4.0], [48.2, 4.0], [48.3, 4.0], [48.4, 4.0], [48.5, 4.0], [48.6, 4.0], [48.7, 4.0], [48.8, 4.0], [48.9, 4.0], [49.0, 4.0], [49.1, 4.0], [49.2, 4.0], [49.3, 4.0], [49.4, 4.0], [49.5, 4.0], [49.6, 4.0], [49.7, 4.0], [49.8, 4.0], [49.9, 4.0], [50.0, 4.0], [50.1, 4.0], [50.2, 4.0], [50.3, 4.0], [50.4, 4.0], [50.5, 4.0], [50.6, 4.0], [50.7, 4.0], [50.8, 4.0], [50.9, 4.0], [51.0, 4.0], [51.1, 4.0], [51.2, 4.0], [51.3, 4.0], [51.4, 4.0], [51.5, 4.0], [51.6, 4.0], [51.7, 4.0], [51.8, 4.0], [51.9, 4.0], [52.0, 4.0], [52.1, 4.0], [52.2, 4.0], [52.3, 4.0], [52.4, 4.0], [52.5, 4.0], [52.6, 4.0], [52.7, 4.0], [52.8, 4.0], [52.9, 4.0], [53.0, 4.0], [53.1, 4.0], [53.2, 4.0], [53.3, 4.0], [53.4, 4.0], [53.5, 4.0], [53.6, 4.0], [53.7, 4.0], [53.8, 4.0], [53.9, 4.0], [54.0, 4.0], [54.1, 4.0], [54.2, 4.0], [54.3, 4.0], [54.4, 4.0], [54.5, 4.0], [54.6, 4.0], [54.7, 4.0], [54.8, 4.0], [54.9, 4.0], [55.0, 4.0], [55.1, 4.0], [55.2, 4.0], [55.3, 4.0], [55.4, 4.0], [55.5, 4.0], [55.6, 4.0], [55.7, 4.0], [55.8, 4.0], [55.9, 4.0], [56.0, 4.0], [56.1, 4.0], [56.2, 4.0], [56.3, 4.0], [56.4, 4.0], [56.5, 4.0], [56.6, 4.0], [56.7, 4.0], [56.8, 4.0], [56.9, 4.0], [57.0, 4.0], [57.1, 4.0], [57.2, 4.0], [57.3, 4.0], [57.4, 4.0], [57.5, 4.0], [57.6, 4.0], [57.7, 4.0], [57.8, 4.0], [57.9, 4.0], [58.0, 4.0], [58.1, 4.0], [58.2, 4.0], [58.3, 4.0], [58.4, 4.0], [58.5, 4.0], [58.6, 4.0], [58.7, 4.0], [58.8, 4.0], [58.9, 4.0], [59.0, 4.0], [59.1, 4.0], [59.2, 4.0], [59.3, 4.0], [59.4, 4.0], [59.5, 4.0], [59.6, 4.0], [59.7, 4.0], [59.8, 4.0], [59.9, 4.0], [60.0, 4.0], [60.1, 4.0], [60.2, 4.0], [60.3, 4.0], [60.4, 4.0], [60.5, 4.0], [60.6, 4.0], [60.7, 4.0], [60.8, 4.0], [60.9, 4.0], [61.0, 4.0], [61.1, 4.0], [61.2, 4.0], [61.3, 4.0], [61.4, 4.0], [61.5, 4.0], [61.6, 4.0], [61.7, 4.0], [61.8, 4.0], [61.9, 4.0], [62.0, 4.0], [62.1, 4.0], [62.2, 4.0], [62.3, 4.0], [62.4, 4.0], [62.5, 4.0], [62.6, 4.0], [62.7, 4.0], [62.8, 4.0], [62.9, 4.0], [63.0, 4.0], [63.1, 4.0], [63.2, 4.0], [63.3, 4.0], [63.4, 4.0], [63.5, 4.0], [63.6, 4.0], [63.7, 4.0], [63.8, 4.0], [63.9, 4.0], [64.0, 4.0], [64.1, 4.0], [64.2, 4.0], [64.3, 4.0], [64.4, 4.0], [64.5, 4.0], [64.6, 4.0], [64.7, 4.0], [64.8, 4.0], [64.9, 4.0], [65.0, 4.0], [65.1, 4.0], [65.2, 4.0], [65.3, 4.0], [65.4, 4.0], [65.5, 4.0], [65.6, 4.0], [65.7, 4.0], [65.8, 4.0], [65.9, 4.0], [66.0, 4.0], [66.1, 4.0], [66.2, 4.0], [66.3, 4.0], [66.4, 4.0], [66.5, 4.0], [66.6, 4.0], [66.7, 4.0], [66.8, 4.0], [66.9, 4.0], [67.0, 4.0], [67.1, 4.0], [67.2, 4.0], [67.3, 4.0], [67.4, 4.0], [67.5, 4.0], [67.6, 4.0], [67.7, 5.0], [67.8, 5.0], [67.9, 5.0], [68.0, 5.0], [68.1, 5.0], [68.2, 5.0], [68.3, 5.0], [68.4, 5.0], [68.5, 5.0], [68.6, 5.0], [68.7, 5.0], [68.8, 5.0], [68.9, 5.0], [69.0, 5.0], [69.1, 5.0], [69.2, 5.0], [69.3, 5.0], [69.4, 5.0], [69.5, 5.0], [69.6, 5.0], [69.7, 5.0], [69.8, 5.0], [69.9, 5.0], [70.0, 5.0], [70.1, 5.0], [70.2, 5.0], [70.3, 5.0], [70.4, 5.0], [70.5, 5.0], [70.6, 5.0], [70.7, 5.0], [70.8, 5.0], [70.9, 5.0], [71.0, 5.0], [71.1, 5.0], [71.2, 5.0], [71.3, 5.0], [71.4, 5.0], [71.5, 5.0], [71.6, 5.0], [71.7, 5.0], [71.8, 5.0], [71.9, 5.0], [72.0, 5.0], [72.1, 5.0], [72.2, 5.0], [72.3, 5.0], [72.4, 5.0], [72.5, 5.0], [72.6, 5.0], [72.7, 5.0], [72.8, 5.0], [72.9, 5.0], [73.0, 5.0], [73.1, 5.0], [73.2, 5.0], [73.3, 5.0], [73.4, 5.0], [73.5, 5.0], [73.6, 5.0], [73.7, 5.0], [73.8, 5.0], [73.9, 5.0], [74.0, 5.0], [74.1, 5.0], [74.2, 5.0], [74.3, 5.0], [74.4, 5.0], [74.5, 5.0], [74.6, 5.0], [74.7, 5.0], [74.8, 5.0], [74.9, 5.0], [75.0, 5.0], [75.1, 5.0], [75.2, 5.0], [75.3, 5.0], [75.4, 5.0], [75.5, 5.0], [75.6, 5.0], [75.7, 5.0], [75.8, 5.0], [75.9, 5.0], [76.0, 5.0], [76.1, 5.0], [76.2, 5.0], [76.3, 5.0], [76.4, 5.0], [76.5, 5.0], [76.6, 5.0], [76.7, 5.0], [76.8, 5.0], [76.9, 5.0], [77.0, 5.0], [77.1, 5.0], [77.2, 5.0], [77.3, 5.0], [77.4, 5.0], [77.5, 5.0], [77.6, 5.0], [77.7, 5.0], [77.8, 5.0], [77.9, 5.0], [78.0, 5.0], [78.1, 5.0], [78.2, 5.0], [78.3, 5.0], [78.4, 5.0], [78.5, 5.0], [78.6, 5.0], [78.7, 5.0], [78.8, 5.0], [78.9, 5.0], [79.0, 5.0], [79.1, 5.0], [79.2, 5.0], [79.3, 5.0], [79.4, 5.0], [79.5, 5.0], [79.6, 5.0], [79.7, 5.0], [79.8, 5.0], [79.9, 5.0], [80.0, 5.0], [80.1, 5.0], [80.2, 5.0], [80.3, 5.0], [80.4, 5.0], [80.5, 5.0], [80.6, 5.0], [80.7, 5.0], [80.8, 5.0], [80.9, 5.0], [81.0, 5.0], [81.1, 5.0], [81.2, 5.0], [81.3, 5.0], [81.4, 5.0], [81.5, 5.0], [81.6, 5.0], [81.7, 5.0], [81.8, 5.0], [81.9, 5.0], [82.0, 5.0], [82.1, 5.0], [82.2, 5.0], [82.3, 5.0], [82.4, 5.0], [82.5, 5.0], [82.6, 5.0], [82.7, 5.0], [82.8, 5.0], [82.9, 5.0], [83.0, 5.0], [83.1, 5.0], [83.2, 5.0], [83.3, 5.0], [83.4, 5.0], [83.5, 5.0], [83.6, 5.0], [83.7, 5.0], [83.8, 5.0], [83.9, 5.0], [84.0, 5.0], [84.1, 5.0], [84.2, 5.0], [84.3, 5.0], [84.4, 5.0], [84.5, 5.0], [84.6, 5.0], [84.7, 5.0], [84.8, 5.0], [84.9, 5.0], [85.0, 5.0], [85.1, 5.0], [85.2, 5.0], [85.3, 5.0], [85.4, 5.0], [85.5, 5.0], [85.6, 5.0], [85.7, 5.0], [85.8, 5.0], [85.9, 5.0], [86.0, 5.0], [86.1, 5.0], [86.2, 5.0], [86.3, 5.0], [86.4, 5.0], [86.5, 5.0], [86.6, 5.0], [86.7, 5.0], [86.8, 5.0], [86.9, 5.0], [87.0, 5.0], [87.1, 6.0], [87.2, 6.0], [87.3, 6.0], [87.4, 6.0], [87.5, 6.0], [87.6, 6.0], [87.7, 6.0], [87.8, 6.0], [87.9, 6.0], [88.0, 6.0], [88.1, 6.0], [88.2, 6.0], [88.3, 6.0], [88.4, 6.0], [88.5, 6.0], [88.6, 6.0], [88.7, 6.0], [88.8, 6.0], [88.9, 6.0], [89.0, 6.0], [89.1, 6.0], [89.2, 6.0], [89.3, 6.0], [89.4, 6.0], [89.5, 6.0], [89.6, 6.0], [89.7, 6.0], [89.8, 6.0], [89.9, 6.0], [90.0, 6.0], [90.1, 6.0], [90.2, 6.0], [90.3, 6.0], [90.4, 6.0], [90.5, 6.0], [90.6, 6.0], [90.7, 6.0], [90.8, 6.0], [90.9, 6.0], [91.0, 6.0], [91.1, 6.0], [91.2, 6.0], [91.3, 6.0], [91.4, 6.0], [91.5, 6.0], [91.6, 6.0], [91.7, 6.0], [91.8, 6.0], [91.9, 6.0], [92.0, 6.0], [92.1, 6.0], [92.2, 6.0], [92.3, 6.0], [92.4, 6.0], [92.5, 6.0], [92.6, 6.0], [92.7, 6.0], [92.8, 6.0], [92.9, 6.0], [93.0, 6.0], [93.1, 6.0], [93.2, 6.0], [93.3, 6.0], [93.4, 6.0], [93.5, 6.0], [93.6, 6.0], [93.7, 6.0], [93.8, 6.0], [93.9, 6.0], [94.0, 6.0], [94.1, 6.0], [94.2, 6.0], [94.3, 6.0], [94.4, 6.0], [94.5, 6.0], [94.6, 6.0], [94.7, 6.0], [94.8, 6.0], [94.9, 7.0], [95.0, 7.0], [95.1, 7.0], [95.2, 7.0], [95.3, 7.0], [95.4, 7.0], [95.5, 7.0], [95.6, 7.0], [95.7, 7.0], [95.8, 7.0], [95.9, 7.0], [96.0, 7.0], [96.1, 7.0], [96.2, 7.0], [96.3, 7.0], [96.4, 7.0], [96.5, 7.0], [96.6, 7.0], [96.7, 7.0], [96.8, 7.0], [96.9, 7.0], [97.0, 7.0], [97.1, 7.0], [97.2, 7.0], [97.3, 8.0], [97.4, 8.0], [97.5, 8.0], [97.6, 8.0], [97.7, 8.0], [97.8, 8.0], [97.9, 8.0], [98.0, 8.0], [98.1, 8.0], [98.2, 9.0], [98.3, 9.0], [98.4, 9.0], [98.5, 9.0], [98.6, 9.0], [98.7, 10.0], [98.8, 10.0], [98.9, 10.0], [99.0, 10.0], [99.1, 11.0], [99.2, 11.0], [99.3, 12.0], [99.4, 12.0], [99.5, 13.0], [99.6, 14.0], [99.7, 16.0], [99.8, 18.0], [99.9, 21.0], [100.0, 28.0]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 14991.0, "minX": 0.0, "maxY": 14991.0, "series": [{"data": [[0.0, 14991.0]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 4.9E-324, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 14991.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 14991.0, "series": [{"data": [[0.0, 14991.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 4.9E-324, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 1.007142857142857, "minX": 1.794976138E12, "maxY": 1.4148936170212771, "series": [{"data": [[1.794976157E12, 1.0312500000000007], [1.794976156E12, 1.0733333333333328], [1.794976155E12, 1.0526315789473684], [1.794976138E12, 1.0422535211267607], [1.794976158E12, 1.3225806451612903], [1.794976152E12, 1.0733333333333328], [1.794976151E12, 1.0779220779220777], [1.79497615E12, 1.047945205479453], [1.794976154E12, 1.066225165562913], [1.794976153E12, 1.1241830065359475], [1.794976146E12, 1.1161290322580653], [1.794976145E12, 1.062937062937063], [1.794976149E12, 1.0723684210526312], [1.794976148E12, 1.1194968553459121], [1.794976147E12, 1.0400000000000005], [1.794976141E12, 1.0354609929078022], [1.79497614E12, 1.0428571428571434], [1.794976139E12, 1.0604026845637584], [1.794976144E12, 1.043478260869566], [1.794976143E12, 1.0503597122302164], [1.794976142E12, 1.033557046979867]], "isOverall": false, "label": "One request group 5", "isController": false}, {"data": [[1.794976157E12, 1.0710059171597635], [1.794976156E12, 1.0544217687074835], [1.794976155E12, 1.0723684210526314], [1.794976138E12, 1.0428571428571425], [1.794976158E12, 1.344086021505376], [1.794976152E12, 1.0466666666666677], [1.794976151E12, 1.045161290322581], [1.79497615E12, 1.082758620689655], [1.794976154E12, 1.046052631578948], [1.794976153E12, 1.111842105263158], [1.794976146E12, 1.174193548387097], [1.794976145E12, 1.0763888888888893], [1.794976149E12, 1.0921052631578947], [1.794976148E12, 1.0573248407643314], [1.794976147E12, 1.0604026845637586], [1.794976141E12, 1.007142857142857], [1.79497614E12, 1.0785714285714285], [1.794976139E12, 1.04026845637584], [1.794976144E12, 1.1021897810218975], [1.794976143E12, 1.0785714285714287], [1.794976142E12, 1.0469798657718128]], "isOverall": false, "label": "One request group 4", "isController": false}, {"data": [[1.794976157E12, 1.0843373493975907], [1.794976156E12, 1.0810810810810811], [1.794976155E12, 1.0789473684210527], [1.794976138E12, 1.0563380281690138], [1.794976158E12, 1.2446808510638299], [1.794976152E12, 1.0666666666666662], [1.794976151E12, 1.0454545454545456], [1.79497615E12, 1.068493150684931], [1.794976154E12, 1.0328947368421069], [1.794976153E12, 1.0909090909090906], [1.794976146E12, 1.129032258064517], [1.794976145E12, 1.0279720279720286], [1.794976149E12, 1.098684210526316], [1.794976148E12, 1.0886075949367089], [1.794976147E12, 1.0268456375838926], [1.794976141E12, 1.05], [1.79497614E12, 1.050359712230216], [1.794976139E12, 1.0469798657718121], [1.794976144E12, 1.0942028985507246], [1.794976143E12, 1.0071942446043163], [1.794976142E12, 1.033112582781459]], "isOverall": false, "label": "One request group 1", "isController": false}, {"data": [[1.794976157E12, 1.0419161676646709], [1.794976156E12, 1.034013605442178], [1.794976155E12, 1.0718954248366004], [1.794976138E12, 1.028169014084507], [1.794976158E12, 1.2765957446808516], [1.794976152E12, 1.1066666666666667], [1.794976151E12, 1.0451612903225806], [1.79497615E12, 1.0344827586206904], [1.794976154E12, 1.0728476821192054], [1.794976153E12, 1.1363636363636365], [1.794976146E12, 1.1032258064516134], [1.794976145E12, 1.0694444444444438], [1.794976149E12, 1.0986842105263153], [1.794976148E12, 1.0891719745222932], [1.794976147E12, 1.040000000000001], [1.794976141E12, 1.0571428571428572], [1.79497614E12, 1.0357142857142863], [1.794976139E12, 1.0604026845637589], [1.794976144E12, 1.0656934306569341], [1.794976143E12, 1.0428571428571431], [1.794976142E12, 1.0728476821192046]], "isOverall": false, "label": "One request group 3", "isController": false}, {"data": [[1.794976157E12, 1.0562500000000004], [1.794976156E12, 1.0939597315436242], [1.794976155E12, 1.0915032679738557], [1.794976138E12, 1.0694444444444442], [1.794976158E12, 1.4148936170212771], [1.794976152E12, 1.0662251655629136], [1.794976151E12, 1.0580645161290325], [1.79497615E12, 1.0136986301369866], [1.794976154E12, 1.0198675496688747], [1.794976153E12, 1.0909090909090906], [1.794976146E12, 1.116129032258065], [1.794976145E12, 1.062937062937063], [1.794976149E12, 1.0657894736842097], [1.794976148E12, 1.0880503144654088], [1.794976147E12, 1.026666666666667], [1.794976141E12, 1.021276595744681], [1.79497614E12, 1.014388489208633], [1.794976139E12, 1.1164383561643831], [1.794976144E12, 1.0510948905109496], [1.794976143E12, 1.0283687943262414], [1.794976142E12, 1.0604026845637584]], "isOverall": false, "label": "One request group 2", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794976158E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 3.823630726834322, "minX": 1.0, "maxY": 14.076923076923077, "series": [{"data": [[2.0, 4.3296743505305635], [8.0, 8.253333333333337], [9.0, 9.333333333333332], [10.0, 11.185185185185183], [11.0, 14.076923076923077], [3.0, 4.1635107471852635], [12.0, 11.0], [13.0, 12.176470588235292], [14.0, 8.333333333333332], [15.0, 12.166666666666668], [4.0, 3.8374025974025994], [1.0, 4.087378640776693], [5.0, 3.823630726834322], [6.0, 6.156387665198238], [7.0, 7.04694835680751]], "isOverall": false, "label": "read", "isController": false}, {"data": [[3.6084317257020975, 4.222199986658654]], "isOverall": false, "label": "read-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 15.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 86975.0, "minX": 1.794976138E12, "maxY": 7835304.0, "series": [{"data": [[1.794976157E12, 7835304.0], [1.794976156E12, 7063212.0], [1.794976155E12, 7263384.0], [1.794976138E12, 3383860.0], [1.794976158E12, 4460976.0], [1.794976152E12, 7158532.0], [1.794976151E12, 7368236.0], [1.79497615E12, 6939296.0], [1.794976154E12, 7215724.0], [1.794976153E12, 7311044.0], [1.794976146E12, 7387300.0], [1.794976145E12, 6834444.0], [1.794976149E12, 7244320.0], [1.794976148E12, 7530280.0], [1.794976147E12, 7129936.0], [1.794976141E12, 6691464.0], [1.79497614E12, 6653336.0], [1.794976139E12, 7072744.0], [1.794976144E12, 6548484.0], [1.794976143E12, 6662868.0], [1.794976142E12, 7139468.0]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.794976157E12, 201390.0], [1.794976156E12, 181545.0], [1.794976155E12, 186690.0], [1.794976138E12, 86975.0], [1.794976158E12, 114660.0], [1.794976152E12, 183995.0], [1.794976151E12, 189385.0], [1.79497615E12, 178360.0], [1.794976154E12, 185465.0], [1.794976153E12, 187915.0], [1.794976146E12, 189875.0], [1.794976145E12, 175665.0], [1.794976149E12, 186200.0], [1.794976148E12, 193550.0], [1.794976147E12, 183260.0], [1.794976141E12, 171990.0], [1.79497614E12, 171010.0], [1.794976139E12, 181790.0], [1.794976144E12, 168315.0], [1.794976143E12, 171255.0], [1.794976142E12, 183505.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794976158E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 3.9355231143552314, "minX": 1.794976138E12, "maxY": 4.782051282051287, "series": [{"data": [[1.794976157E12, 3.9355231143552314], [1.794976156E12, 4.1997300944669345], [1.794976155E12, 4.060367454068236], [1.794976138E12, 4.208450704225353], [1.794976158E12, 4.782051282051287], [1.794976152E12, 4.350199733688415], [1.794976151E12, 4.072445019404913], [1.79497615E12, 4.103021978021976], [1.794976154E12, 4.140026420079261], [1.794976153E12, 4.482398956975225], [1.794976146E12, 4.625806451612896], [1.794976145E12, 4.200836820083688], [1.794976149E12, 4.3999999999999995], [1.794976148E12, 4.459493670886076], [1.794976147E12, 4.00935828877005], [1.794976141E12, 4.051282051282054], [1.79497614E12, 4.011461318051574], [1.794976139E12, 4.289757412398924], [1.794976144E12, 4.366812227074234], [1.794976143E12, 4.008583690987128], [1.794976142E12, 4.080106809078767]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794976158E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 3.92457420924574, "minX": 1.794976138E12, "maxY": 4.771367521367523, "series": [{"data": [[1.794976157E12, 3.92457420924574], [1.794976156E12, 4.186234817813768], [1.794976155E12, 4.049868766404199], [1.794976138E12, 4.197183098591547], [1.794976158E12, 4.771367521367523], [1.794976152E12, 4.343541944074566], [1.794976151E12, 4.060802069857704], [1.79497615E12, 4.094780219780224], [1.794976154E12, 4.129458388375169], [1.794976153E12, 4.475880052151245], [1.794976146E12, 4.611612903225799], [1.794976145E12, 4.189679218967921], [1.794976149E12, 4.389473684210525], [1.794976148E12, 4.446835443037971], [1.794976147E12, 3.9839572192513395], [1.794976141E12, 4.044159544159546], [1.79497614E12, 4.005730659025787], [1.794976139E12, 4.283018867924524], [1.794976144E12, 4.356622998544396], [1.794976143E12, 4.001430615164527], [1.794976142E12, 4.072096128170892]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794976158E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.17305151915455755, "minX": 1.794976138E12, "maxY": 0.2401746724890831, "series": [{"data": [[1.794976157E12, 0.20437956204379568], [1.794976156E12, 0.2010796221322535], [1.794976155E12, 0.19553805774278193], [1.794976138E12, 0.19154929577464785], [1.794976158E12, 0.20726495726495703], [1.794976152E12, 0.1970705725699067], [1.794976151E12, 0.22380336351875804], [1.79497615E12, 0.2032967032967035], [1.794976154E12, 0.17305151915455755], [1.794976153E12, 0.2059973924380706], [1.794976146E12, 0.20516129032258068], [1.794976145E12, 0.22175732217573213], [1.794976149E12, 0.20263157894736847], [1.794976148E12, 0.2025316455696202], [1.794976147E12, 0.20855614973262032], [1.794976141E12, 0.215099715099715], [1.79497614E12, 0.2306590257879656], [1.794976139E12, 0.233153638814016], [1.794976144E12, 0.2401746724890831], [1.794976143E12, 0.2002861230329042], [1.794976142E12, 0.21762349799732986]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794976158E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 2.0, "minX": 1.794976138E12, "maxY": 28.0, "series": [{"data": [[1.794976157E12, 15.0], [1.794976156E12, 19.0], [1.794976155E12, 18.0], [1.794976138E12, 13.0], [1.794976158E12, 21.0], [1.794976152E12, 14.0], [1.794976151E12, 20.0], [1.79497615E12, 12.0], [1.794976154E12, 14.0], [1.794976153E12, 27.0], [1.794976146E12, 23.0], [1.794976145E12, 13.0], [1.794976149E12, 23.0], [1.794976148E12, 28.0], [1.794976147E12, 9.0], [1.794976141E12, 14.0], [1.79497614E12, 22.0], [1.794976139E12, 12.0], [1.794976144E12, 21.0], [1.794976143E12, 13.0], [1.794976142E12, 9.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.794976157E12, 2.0], [1.794976156E12, 2.0], [1.794976155E12, 2.0], [1.794976138E12, 2.0], [1.794976158E12, 2.0], [1.794976152E12, 2.0], [1.794976151E12, 2.0], [1.79497615E12, 2.0], [1.794976154E12, 2.0], [1.794976153E12, 2.0], [1.794976146E12, 2.0], [1.794976145E12, 2.0], [1.794976149E12, 2.0], [1.794976148E12, 2.0], [1.794976147E12, 2.0], [1.794976141E12, 2.0], [1.79497614E12, 2.0], [1.794976139E12, 2.0], [1.794976144E12, 2.0], [1.794976143E12, 2.0], [1.794976142E12, 2.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.794976157E12, 5.0], [1.794976156E12, 6.0], [1.794976155E12, 6.0], [1.794976138E12, 6.0], [1.794976158E12, 7.0], [1.794976152E12, 6.0], [1.794976151E12, 6.0], [1.79497615E12, 6.0], [1.794976154E12, 6.0], [1.794976153E12, 6.0], [1.794976146E12, 6.0], [1.794976145E12, 6.0], [1.794976149E12, 6.0], [1.794976148E12, 6.0], [1.794976147E12, 5.0], [1.794976141E12, 6.0], [1.79497614E12, 5.0], [1.794976139E12, 6.0], [1.794976144E12, 6.0], [1.794976143E12, 6.0], [1.794976142E12, 6.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.794976157E12, 8.0], [1.794976156E12, 13.0], [1.794976155E12, 12.0], [1.794976138E12, 10.0], [1.794976158E12, 16.0], [1.794976152E12, 10.0], [1.794976151E12, 10.519999999999982], [1.79497615E12, 9.0], [1.794976154E12, 10.0], [1.794976153E12, 14.639999999999873], [1.794976146E12, 15.0], [1.794976145E12, 9.82000000000005], [1.794976149E12, 12.0], [1.794976148E12, 15.090000000000032], [1.794976147E12, 8.0], [1.794976141E12, 8.0], [1.79497614E12, 10.0], [1.794976139E12, 9.0], [1.794976144E12, 15.0], [1.794976143E12, 9.0], [1.794976142E12, 8.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.794976157E12, 4.0], [1.794976156E12, 4.0], [1.794976155E12, 4.0], [1.794976138E12, 4.0], [1.794976158E12, 4.0], [1.794976152E12, 4.0], [1.794976151E12, 4.0], [1.79497615E12, 4.0], [1.794976154E12, 4.0], [1.794976153E12, 4.0], [1.794976146E12, 4.0], [1.794976145E12, 4.0], [1.794976149E12, 4.0], [1.794976148E12, 4.0], [1.794976147E12, 4.0], [1.794976141E12, 4.0], [1.79497614E12, 4.0], [1.794976139E12, 4.0], [1.794976144E12, 4.0], [1.794976143E12, 4.0], [1.794976142E12, 4.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.794976157E12, 6.0], [1.794976156E12, 6.0], [1.794976155E12, 6.0], [1.794976138E12, 6.0], [1.794976158E12, 8.0], [1.794976152E12, 7.0], [1.794976151E12, 6.0], [1.79497615E12, 6.0], [1.794976154E12, 6.0], [1.794976153E12, 7.0], [1.794976146E12, 7.199999999999932], [1.794976145E12, 6.0], [1.794976149E12, 7.0], [1.794976148E12, 7.0], [1.794976147E12, 6.0], [1.794976141E12, 6.0], [1.79497614E12, 6.0], [1.794976139E12, 7.0], [1.794976144E12, 7.0], [1.794976143E12, 6.0], [1.794976142E12, 6.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794976158E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 4.0, "minX": 355.0, "maxY": 4.0, "series": [{"data": [[698.0, 4.0], [702.0, 4.0], [699.0, 4.0], [687.0, 4.0], [717.0, 4.0], [728.0, 4.0], [742.0, 4.0], [749.0, 4.0], [748.0, 4.0], [760.0, 4.0], [751.0, 4.0], [767.0, 4.0], [757.0, 4.0], [762.0, 4.0], [741.0, 4.0], [775.0, 4.0], [790.0, 4.0], [773.0, 4.0], [822.0, 4.0], [355.0, 4.0], [468.0, 4.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 822.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 4.0, "minX": 355.0, "maxY": 4.0, "series": [{"data": [[698.0, 4.0], [702.0, 4.0], [699.0, 4.0], [687.0, 4.0], [717.0, 4.0], [728.0, 4.0], [742.0, 4.0], [749.0, 4.0], [748.0, 4.0], [760.0, 4.0], [751.0, 4.0], [767.0, 4.0], [757.0, 4.0], [762.0, 4.0], [741.0, 4.0], [775.0, 4.0], [790.0, 4.0], [773.0, 4.0], [822.0, 4.0], [355.0, 4.0], [468.0, 4.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 822.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 359.0, "minX": 1.794976138E12, "maxY": 818.0, "series": [{"data": [[1.794976157E12, 818.0], [1.794976156E12, 743.0], [1.794976155E12, 763.0], [1.794976138E12, 359.0], [1.794976158E12, 468.0], [1.794976152E12, 750.0], [1.794976151E12, 771.0], [1.79497615E12, 729.0], [1.794976154E12, 754.0], [1.794976153E12, 769.0], [1.794976146E12, 773.0], [1.794976145E12, 719.0], [1.794976149E12, 762.0], [1.794976148E12, 789.0], [1.794976147E12, 748.0], [1.794976141E12, 707.0], [1.79497614E12, 697.0], [1.794976139E12, 741.0], [1.794976144E12, 686.0], [1.794976143E12, 702.0], [1.794976142E12, 743.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794976158E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 355.0, "minX": 1.794976138E12, "maxY": 822.0, "series": [{"data": [[1.794976157E12, 822.0], [1.794976156E12, 741.0], [1.794976155E12, 762.0], [1.794976138E12, 355.0], [1.794976158E12, 468.0], [1.794976152E12, 751.0], [1.794976151E12, 773.0], [1.79497615E12, 728.0], [1.794976154E12, 757.0], [1.794976153E12, 767.0], [1.794976146E12, 775.0], [1.794976145E12, 717.0], [1.794976149E12, 760.0], [1.794976148E12, 790.0], [1.794976147E12, 748.0], [1.794976141E12, 702.0], [1.79497614E12, 698.0], [1.794976139E12, 742.0], [1.794976144E12, 687.0], [1.794976143E12, 699.0], [1.794976142E12, 749.0]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794976158E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 355.0, "minX": 1.794976138E12, "maxY": 822.0, "series": [{"data": [[1.794976157E12, 822.0], [1.794976156E12, 741.0], [1.794976155E12, 762.0], [1.794976138E12, 355.0], [1.794976158E12, 468.0], [1.794976152E12, 751.0], [1.794976151E12, 773.0], [1.79497615E12, 728.0], [1.794976154E12, 757.0], [1.794976153E12, 767.0], [1.794976146E12, 775.0], [1.794976145E12, 717.0], [1.794976149E12, 760.0], [1.794976148E12, 790.0], [1.794976147E12, 748.0], [1.794976141E12, 702.0], [1.79497614E12, 698.0], [1.794976139E12, 742.0], [1.794976144E12, 687.0], [1.794976143E12, 699.0], [1.794976142E12, 749.0]], "isOverall": false, "label": "read-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794976158E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 355.0, "minX": 1.794976138E12, "maxY": 822.0, "series": [{"data": [[1.794976157E12, 822.0], [1.794976156E12, 741.0], [1.794976155E12, 762.0], [1.794976138E12, 355.0], [1.794976158E12, 468.0], [1.794976152E12, 751.0], [1.794976151E12, 773.0], [1.79497615E12, 728.0], [1.794976154E12, 757.0], [1.794976153E12, 767.0], [1.794976146E12, 775.0], [1.794976145E12, 717.0], [1.794976149E12, 760.0], [1.794976148E12, 790.0], [1.794976147E12, 748.0], [1.794976141E12, 702.0], [1.79497614E12, 698.0], [1.794976139E12, 742.0], [1.794976144E12, 687.0], [1.794976143E12, 699.0], [1.794976142E12, 749.0]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794976158E12, "title": "Total Transactions Per Second"}},
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

