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
        data: {"result": {"minY": 4.0, "minX": 0.0, "maxY": 360.0, "series": [{"data": [[0.0, 4.0], [0.1, 7.0], [0.2, 8.0], [0.3, 8.0], [0.4, 9.0], [0.5, 9.0], [0.6, 10.0], [0.7, 10.0], [0.8, 10.0], [0.9, 10.0], [1.0, 11.0], [1.1, 11.0], [1.2, 11.0], [1.3, 11.0], [1.4, 12.0], [1.5, 12.0], [1.6, 12.0], [1.7, 12.0], [1.8, 13.0], [1.9, 13.0], [2.0, 13.0], [2.1, 13.0], [2.2, 13.0], [2.3, 13.0], [2.4, 14.0], [2.5, 14.0], [2.6, 14.0], [2.7, 14.0], [2.8, 14.0], [2.9, 14.0], [3.0, 14.0], [3.1, 15.0], [3.2, 15.0], [3.3, 15.0], [3.4, 15.0], [3.5, 15.0], [3.6, 15.0], [3.7, 16.0], [3.8, 16.0], [3.9, 16.0], [4.0, 16.0], [4.1, 16.0], [4.2, 16.0], [4.3, 17.0], [4.4, 17.0], [4.5, 17.0], [4.6, 17.0], [4.7, 17.0], [4.8, 17.0], [4.9, 17.0], [5.0, 18.0], [5.1, 18.0], [5.2, 18.0], [5.3, 18.0], [5.4, 18.0], [5.5, 18.0], [5.6, 19.0], [5.7, 19.0], [5.8, 19.0], [5.9, 19.0], [6.0, 19.0], [6.1, 20.0], [6.2, 20.0], [6.3, 20.0], [6.4, 20.0], [6.5, 20.0], [6.6, 20.0], [6.7, 21.0], [6.8, 21.0], [6.9, 21.0], [7.0, 21.0], [7.1, 22.0], [7.2, 22.0], [7.3, 22.0], [7.4, 22.0], [7.5, 22.0], [7.6, 23.0], [7.7, 23.0], [7.8, 23.0], [7.9, 23.0], [8.0, 24.0], [8.1, 24.0], [8.2, 24.0], [8.3, 24.0], [8.4, 25.0], [8.5, 25.0], [8.6, 25.0], [8.7, 26.0], [8.8, 26.0], [8.9, 26.0], [9.0, 27.0], [9.1, 27.0], [9.2, 27.0], [9.3, 28.0], [9.4, 28.0], [9.5, 29.0], [9.6, 29.0], [9.7, 30.0], [9.8, 31.0], [9.9, 32.0], [10.0, 33.0], [10.1, 35.0], [10.2, 39.0], [10.3, 46.0], [10.4, 49.0], [10.5, 50.0], [10.6, 51.0], [10.7, 51.0], [10.8, 52.0], [10.9, 52.0], [11.0, 52.0], [11.1, 53.0], [11.2, 53.0], [11.3, 53.0], [11.4, 53.0], [11.5, 54.0], [11.6, 54.0], [11.7, 54.0], [11.8, 54.0], [11.9, 54.0], [12.0, 54.0], [12.1, 55.0], [12.2, 55.0], [12.3, 55.0], [12.4, 55.0], [12.5, 55.0], [12.6, 55.0], [12.7, 55.0], [12.8, 56.0], [12.9, 56.0], [13.0, 56.0], [13.1, 56.0], [13.2, 56.0], [13.3, 56.0], [13.4, 56.0], [13.5, 56.0], [13.6, 56.0], [13.7, 57.0], [13.8, 57.0], [13.9, 57.0], [14.0, 57.0], [14.1, 57.0], [14.2, 57.0], [14.3, 57.0], [14.4, 57.0], [14.5, 57.0], [14.6, 57.0], [14.7, 58.0], [14.8, 58.0], [14.9, 58.0], [15.0, 58.0], [15.1, 58.0], [15.2, 58.0], [15.3, 58.0], [15.4, 58.0], [15.5, 58.0], [15.6, 58.0], [15.7, 58.0], [15.8, 58.0], [15.9, 59.0], [16.0, 59.0], [16.1, 59.0], [16.2, 59.0], [16.3, 59.0], [16.4, 59.0], [16.5, 59.0], [16.6, 59.0], [16.7, 59.0], [16.8, 59.0], [16.9, 59.0], [17.0, 59.0], [17.1, 59.0], [17.2, 59.0], [17.3, 59.0], [17.4, 59.0], [17.5, 59.0], [17.6, 60.0], [17.7, 60.0], [17.8, 60.0], [17.9, 60.0], [18.0, 60.0], [18.1, 60.0], [18.2, 60.0], [18.3, 60.0], [18.4, 60.0], [18.5, 60.0], [18.6, 60.0], [18.7, 60.0], [18.8, 60.0], [18.9, 60.0], [19.0, 60.0], [19.1, 60.0], [19.2, 60.0], [19.3, 60.0], [19.4, 60.0], [19.5, 60.0], [19.6, 61.0], [19.7, 61.0], [19.8, 61.0], [19.9, 61.0], [20.0, 61.0], [20.1, 61.0], [20.2, 61.0], [20.3, 61.0], [20.4, 61.0], [20.5, 61.0], [20.6, 61.0], [20.7, 61.0], [20.8, 61.0], [20.9, 61.0], [21.0, 61.0], [21.1, 61.0], [21.2, 61.0], [21.3, 61.0], [21.4, 61.0], [21.5, 61.0], [21.6, 61.0], [21.7, 62.0], [21.8, 62.0], [21.9, 62.0], [22.0, 62.0], [22.1, 62.0], [22.2, 62.0], [22.3, 62.0], [22.4, 62.0], [22.5, 62.0], [22.6, 62.0], [22.7, 62.0], [22.8, 62.0], [22.9, 62.0], [23.0, 62.0], [23.1, 62.0], [23.2, 62.0], [23.3, 62.0], [23.4, 62.0], [23.5, 62.0], [23.6, 62.0], [23.7, 62.0], [23.8, 62.0], [23.9, 62.0], [24.0, 62.0], [24.1, 62.0], [24.2, 63.0], [24.3, 63.0], [24.4, 63.0], [24.5, 63.0], [24.6, 63.0], [24.7, 63.0], [24.8, 63.0], [24.9, 63.0], [25.0, 63.0], [25.1, 63.0], [25.2, 63.0], [25.3, 63.0], [25.4, 63.0], [25.5, 63.0], [25.6, 63.0], [25.7, 63.0], [25.8, 63.0], [25.9, 63.0], [26.0, 63.0], [26.1, 63.0], [26.2, 63.0], [26.3, 63.0], [26.4, 63.0], [26.5, 63.0], [26.6, 63.0], [26.7, 64.0], [26.8, 64.0], [26.9, 64.0], [27.0, 64.0], [27.1, 64.0], [27.2, 64.0], [27.3, 64.0], [27.4, 64.0], [27.5, 64.0], [27.6, 64.0], [27.7, 64.0], [27.8, 64.0], [27.9, 64.0], [28.0, 64.0], [28.1, 64.0], [28.2, 64.0], [28.3, 64.0], [28.4, 64.0], [28.5, 64.0], [28.6, 64.0], [28.7, 64.0], [28.8, 64.0], [28.9, 64.0], [29.0, 64.0], [29.1, 64.0], [29.2, 64.0], [29.3, 64.0], [29.4, 64.0], [29.5, 64.0], [29.6, 65.0], [29.7, 65.0], [29.8, 65.0], [29.9, 65.0], [30.0, 65.0], [30.1, 65.0], [30.2, 65.0], [30.3, 65.0], [30.4, 65.0], [30.5, 65.0], [30.6, 65.0], [30.7, 65.0], [30.8, 65.0], [30.9, 65.0], [31.0, 65.0], [31.1, 65.0], [31.2, 65.0], [31.3, 65.0], [31.4, 65.0], [31.5, 65.0], [31.6, 65.0], [31.7, 65.0], [31.8, 65.0], [31.9, 65.0], [32.0, 65.0], [32.1, 65.0], [32.2, 65.0], [32.3, 65.0], [32.4, 65.0], [32.5, 65.0], [32.6, 65.0], [32.7, 66.0], [32.8, 66.0], [32.9, 66.0], [33.0, 66.0], [33.1, 66.0], [33.2, 66.0], [33.3, 66.0], [33.4, 66.0], [33.5, 66.0], [33.6, 66.0], [33.7, 66.0], [33.8, 66.0], [33.9, 66.0], [34.0, 66.0], [34.1, 66.0], [34.2, 66.0], [34.3, 66.0], [34.4, 66.0], [34.5, 66.0], [34.6, 66.0], [34.7, 66.0], [34.8, 66.0], [34.9, 66.0], [35.0, 66.0], [35.1, 66.0], [35.2, 66.0], [35.3, 66.0], [35.4, 66.0], [35.5, 66.0], [35.6, 66.0], [35.7, 66.0], [35.8, 66.0], [35.9, 67.0], [36.0, 67.0], [36.1, 67.0], [36.2, 67.0], [36.3, 67.0], [36.4, 67.0], [36.5, 67.0], [36.6, 67.0], [36.7, 67.0], [36.8, 67.0], [36.9, 67.0], [37.0, 67.0], [37.1, 67.0], [37.2, 67.0], [37.3, 67.0], [37.4, 67.0], [37.5, 67.0], [37.6, 67.0], [37.7, 67.0], [37.8, 67.0], [37.9, 67.0], [38.0, 67.0], [38.1, 67.0], [38.2, 67.0], [38.3, 67.0], [38.4, 67.0], [38.5, 67.0], [38.6, 67.0], [38.7, 67.0], [38.8, 67.0], [38.9, 67.0], [39.0, 67.0], [39.1, 67.0], [39.2, 67.0], [39.3, 68.0], [39.4, 68.0], [39.5, 68.0], [39.6, 68.0], [39.7, 68.0], [39.8, 68.0], [39.9, 68.0], [40.0, 68.0], [40.1, 68.0], [40.2, 68.0], [40.3, 68.0], [40.4, 68.0], [40.5, 68.0], [40.6, 68.0], [40.7, 68.0], [40.8, 68.0], [40.9, 68.0], [41.0, 68.0], [41.1, 68.0], [41.2, 68.0], [41.3, 68.0], [41.4, 68.0], [41.5, 68.0], [41.6, 68.0], [41.7, 68.0], [41.8, 68.0], [41.9, 68.0], [42.0, 68.0], [42.1, 68.0], [42.2, 68.0], [42.3, 68.0], [42.4, 68.0], [42.5, 68.0], [42.6, 69.0], [42.7, 69.0], [42.8, 69.0], [42.9, 69.0], [43.0, 69.0], [43.1, 69.0], [43.2, 69.0], [43.3, 69.0], [43.4, 69.0], [43.5, 69.0], [43.6, 69.0], [43.7, 69.0], [43.8, 69.0], [43.9, 69.0], [44.0, 69.0], [44.1, 69.0], [44.2, 69.0], [44.3, 69.0], [44.4, 69.0], [44.5, 69.0], [44.6, 69.0], [44.7, 69.0], [44.8, 69.0], [44.9, 69.0], [45.0, 69.0], [45.1, 69.0], [45.2, 69.0], [45.3, 69.0], [45.4, 69.0], [45.5, 69.0], [45.6, 69.0], [45.7, 69.0], [45.8, 69.0], [45.9, 70.0], [46.0, 70.0], [46.1, 70.0], [46.2, 70.0], [46.3, 70.0], [46.4, 70.0], [46.5, 70.0], [46.6, 70.0], [46.7, 70.0], [46.8, 70.0], [46.9, 70.0], [47.0, 70.0], [47.1, 70.0], [47.2, 70.0], [47.3, 70.0], [47.4, 70.0], [47.5, 70.0], [47.6, 70.0], [47.7, 70.0], [47.8, 70.0], [47.9, 70.0], [48.0, 70.0], [48.1, 70.0], [48.2, 70.0], [48.3, 70.0], [48.4, 70.0], [48.5, 70.0], [48.6, 70.0], [48.7, 70.0], [48.8, 70.0], [48.9, 70.0], [49.0, 70.0], [49.1, 70.0], [49.2, 71.0], [49.3, 71.0], [49.4, 71.0], [49.5, 71.0], [49.6, 71.0], [49.7, 71.0], [49.8, 71.0], [49.9, 71.0], [50.0, 71.0], [50.1, 71.0], [50.2, 71.0], [50.3, 71.0], [50.4, 71.0], [50.5, 71.0], [50.6, 71.0], [50.7, 71.0], [50.8, 71.0], [50.9, 71.0], [51.0, 71.0], [51.1, 71.0], [51.2, 71.0], [51.3, 71.0], [51.4, 71.0], [51.5, 71.0], [51.6, 71.0], [51.7, 71.0], [51.8, 71.0], [51.9, 71.0], [52.0, 71.0], [52.1, 71.0], [52.2, 71.0], [52.3, 71.0], [52.4, 71.0], [52.5, 71.0], [52.6, 72.0], [52.7, 72.0], [52.8, 72.0], [52.9, 72.0], [53.0, 72.0], [53.1, 72.0], [53.2, 72.0], [53.3, 72.0], [53.4, 72.0], [53.5, 72.0], [53.6, 72.0], [53.7, 72.0], [53.8, 72.0], [53.9, 72.0], [54.0, 72.0], [54.1, 72.0], [54.2, 72.0], [54.3, 72.0], [54.4, 72.0], [54.5, 72.0], [54.6, 72.0], [54.7, 72.0], [54.8, 72.0], [54.9, 72.0], [55.0, 72.0], [55.1, 72.0], [55.2, 72.0], [55.3, 72.0], [55.4, 72.0], [55.5, 72.0], [55.6, 72.0], [55.7, 72.0], [55.8, 73.0], [55.9, 73.0], [56.0, 73.0], [56.1, 73.0], [56.2, 73.0], [56.3, 73.0], [56.4, 73.0], [56.5, 73.0], [56.6, 73.0], [56.7, 73.0], [56.8, 73.0], [56.9, 73.0], [57.0, 73.0], [57.1, 73.0], [57.2, 73.0], [57.3, 73.0], [57.4, 73.0], [57.5, 73.0], [57.6, 73.0], [57.7, 73.0], [57.8, 73.0], [57.9, 73.0], [58.0, 73.0], [58.1, 73.0], [58.2, 73.0], [58.3, 73.0], [58.4, 73.0], [58.5, 73.0], [58.6, 73.0], [58.7, 73.0], [58.8, 73.0], [58.9, 73.0], [59.0, 74.0], [59.1, 74.0], [59.2, 74.0], [59.3, 74.0], [59.4, 74.0], [59.5, 74.0], [59.6, 74.0], [59.7, 74.0], [59.8, 74.0], [59.9, 74.0], [60.0, 74.0], [60.1, 74.0], [60.2, 74.0], [60.3, 74.0], [60.4, 74.0], [60.5, 74.0], [60.6, 74.0], [60.7, 74.0], [60.8, 74.0], [60.9, 74.0], [61.0, 74.0], [61.1, 74.0], [61.2, 74.0], [61.3, 74.0], [61.4, 74.0], [61.5, 74.0], [61.6, 74.0], [61.7, 74.0], [61.8, 74.0], [61.9, 74.0], [62.0, 75.0], [62.1, 75.0], [62.2, 75.0], [62.3, 75.0], [62.4, 75.0], [62.5, 75.0], [62.6, 75.0], [62.7, 75.0], [62.8, 75.0], [62.9, 75.0], [63.0, 75.0], [63.1, 75.0], [63.2, 75.0], [63.3, 75.0], [63.4, 75.0], [63.5, 75.0], [63.6, 75.0], [63.7, 75.0], [63.8, 75.0], [63.9, 75.0], [64.0, 75.0], [64.1, 75.0], [64.2, 75.0], [64.3, 75.0], [64.4, 75.0], [64.5, 75.0], [64.6, 75.0], [64.7, 75.0], [64.8, 76.0], [64.9, 76.0], [65.0, 76.0], [65.1, 76.0], [65.2, 76.0], [65.3, 76.0], [65.4, 76.0], [65.5, 76.0], [65.6, 76.0], [65.7, 76.0], [65.8, 76.0], [65.9, 76.0], [66.0, 76.0], [66.1, 76.0], [66.2, 76.0], [66.3, 76.0], [66.4, 76.0], [66.5, 76.0], [66.6, 76.0], [66.7, 76.0], [66.8, 76.0], [66.9, 76.0], [67.0, 76.0], [67.1, 76.0], [67.2, 76.0], [67.3, 76.0], [67.4, 76.0], [67.5, 76.0], [67.6, 77.0], [67.7, 77.0], [67.8, 77.0], [67.9, 77.0], [68.0, 77.0], [68.1, 77.0], [68.2, 77.0], [68.3, 77.0], [68.4, 77.0], [68.5, 77.0], [68.6, 77.0], [68.7, 77.0], [68.8, 77.0], [68.9, 77.0], [69.0, 77.0], [69.1, 77.0], [69.2, 77.0], [69.3, 77.0], [69.4, 77.0], [69.5, 77.0], [69.6, 77.0], [69.7, 77.0], [69.8, 77.0], [69.9, 77.0], [70.0, 78.0], [70.1, 78.0], [70.2, 78.0], [70.3, 78.0], [70.4, 78.0], [70.5, 78.0], [70.6, 78.0], [70.7, 78.0], [70.8, 78.0], [70.9, 78.0], [71.0, 78.0], [71.1, 78.0], [71.2, 78.0], [71.3, 78.0], [71.4, 78.0], [71.5, 78.0], [71.6, 78.0], [71.7, 78.0], [71.8, 78.0], [71.9, 78.0], [72.0, 78.0], [72.1, 78.0], [72.2, 78.0], [72.3, 79.0], [72.4, 79.0], [72.5, 79.0], [72.6, 79.0], [72.7, 79.0], [72.8, 79.0], [72.9, 79.0], [73.0, 79.0], [73.1, 79.0], [73.2, 79.0], [73.3, 79.0], [73.4, 79.0], [73.5, 79.0], [73.6, 79.0], [73.7, 79.0], [73.8, 79.0], [73.9, 79.0], [74.0, 79.0], [74.1, 79.0], [74.2, 79.0], [74.3, 79.0], [74.4, 79.0], [74.5, 80.0], [74.6, 80.0], [74.7, 80.0], [74.8, 80.0], [74.9, 80.0], [75.0, 80.0], [75.1, 80.0], [75.2, 80.0], [75.3, 80.0], [75.4, 80.0], [75.5, 80.0], [75.6, 80.0], [75.7, 80.0], [75.8, 80.0], [75.9, 80.0], [76.0, 80.0], [76.1, 80.0], [76.2, 80.0], [76.3, 80.0], [76.4, 80.0], [76.5, 81.0], [76.6, 81.0], [76.7, 81.0], [76.8, 81.0], [76.9, 81.0], [77.0, 81.0], [77.1, 81.0], [77.2, 81.0], [77.3, 81.0], [77.4, 81.0], [77.5, 81.0], [77.6, 81.0], [77.7, 81.0], [77.8, 81.0], [77.9, 81.0], [78.0, 81.0], [78.1, 81.0], [78.2, 81.0], [78.3, 82.0], [78.4, 82.0], [78.5, 82.0], [78.6, 82.0], [78.7, 82.0], [78.8, 82.0], [78.9, 82.0], [79.0, 82.0], [79.1, 82.0], [79.2, 82.0], [79.3, 82.0], [79.4, 82.0], [79.5, 82.0], [79.6, 82.0], [79.7, 82.0], [79.8, 82.0], [79.9, 82.0], [80.0, 83.0], [80.1, 83.0], [80.2, 83.0], [80.3, 83.0], [80.4, 83.0], [80.5, 83.0], [80.6, 83.0], [80.7, 83.0], [80.8, 83.0], [80.9, 83.0], [81.0, 83.0], [81.1, 83.0], [81.2, 83.0], [81.3, 83.0], [81.4, 84.0], [81.5, 84.0], [81.6, 84.0], [81.7, 84.0], [81.8, 84.0], [81.9, 84.0], [82.0, 84.0], [82.1, 84.0], [82.2, 84.0], [82.3, 84.0], [82.4, 84.0], [82.5, 84.0], [82.6, 84.0], [82.7, 85.0], [82.8, 85.0], [82.9, 85.0], [83.0, 85.0], [83.1, 85.0], [83.2, 85.0], [83.3, 85.0], [83.4, 85.0], [83.5, 85.0], [83.6, 85.0], [83.7, 85.0], [83.8, 86.0], [83.9, 86.0], [84.0, 86.0], [84.1, 86.0], [84.2, 86.0], [84.3, 86.0], [84.4, 86.0], [84.5, 86.0], [84.6, 86.0], [84.7, 86.0], [84.8, 86.0], [84.9, 87.0], [85.0, 87.0], [85.1, 87.0], [85.2, 87.0], [85.3, 87.0], [85.4, 87.0], [85.5, 87.0], [85.6, 87.0], [85.7, 87.0], [85.8, 88.0], [85.9, 88.0], [86.0, 88.0], [86.1, 88.0], [86.2, 88.0], [86.3, 88.0], [86.4, 88.0], [86.5, 88.0], [86.6, 89.0], [86.7, 89.0], [86.8, 89.0], [86.9, 89.0], [87.0, 89.0], [87.1, 89.0], [87.2, 90.0], [87.3, 90.0], [87.4, 90.0], [87.5, 90.0], [87.6, 90.0], [87.7, 91.0], [87.8, 91.0], [87.9, 91.0], [88.0, 91.0], [88.1, 91.0], [88.2, 92.0], [88.3, 92.0], [88.4, 92.0], [88.5, 92.0], [88.6, 92.0], [88.7, 93.0], [88.8, 93.0], [88.9, 93.0], [89.0, 93.0], [89.1, 94.0], [89.2, 94.0], [89.3, 94.0], [89.4, 95.0], [89.5, 95.0], [89.6, 95.0], [89.7, 96.0], [89.8, 96.0], [89.9, 97.0], [90.0, 97.0], [90.1, 98.0], [90.2, 99.0], [90.3, 99.0], [90.4, 100.0], [90.5, 101.0], [90.6, 102.0], [90.7, 103.0], [90.8, 103.0], [90.9, 104.0], [91.0, 106.0], [91.1, 107.0], [91.2, 108.0], [91.3, 108.0], [91.4, 109.0], [91.5, 110.0], [91.6, 110.0], [91.7, 111.0], [91.8, 111.0], [91.9, 112.0], [92.0, 113.0], [92.1, 113.0], [92.2, 114.0], [92.3, 114.0], [92.4, 115.0], [92.5, 115.0], [92.6, 115.0], [92.7, 116.0], [92.8, 116.0], [92.9, 117.0], [93.0, 117.0], [93.1, 118.0], [93.2, 118.0], [93.3, 118.0], [93.4, 119.0], [93.5, 119.0], [93.6, 120.0], [93.7, 120.0], [93.8, 120.0], [93.9, 121.0], [94.0, 121.0], [94.1, 122.0], [94.2, 122.0], [94.3, 122.0], [94.4, 123.0], [94.5, 123.0], [94.6, 123.0], [94.7, 124.0], [94.8, 124.0], [94.9, 124.0], [95.0, 125.0], [95.1, 125.0], [95.2, 125.0], [95.3, 126.0], [95.4, 126.0], [95.5, 127.0], [95.6, 127.0], [95.7, 127.0], [95.8, 128.0], [95.9, 128.0], [96.0, 129.0], [96.1, 129.0], [96.2, 130.0], [96.3, 130.0], [96.4, 131.0], [96.5, 131.0], [96.6, 132.0], [96.7, 132.0], [96.8, 133.0], [96.9, 133.0], [97.0, 134.0], [97.1, 134.0], [97.2, 135.0], [97.3, 136.0], [97.4, 136.0], [97.5, 137.0], [97.6, 138.0], [97.7, 139.0], [97.8, 141.0], [97.9, 142.0], [98.0, 143.0], [98.1, 144.0], [98.2, 145.0], [98.3, 147.0], [98.4, 148.0], [98.5, 149.0], [98.6, 151.0], [98.7, 153.0], [98.8, 155.0], [98.9, 157.0], [99.0, 160.0], [99.1, 163.0], [99.2, 166.0], [99.3, 171.0], [99.4, 175.0], [99.5, 180.0], [99.6, 188.0], [99.7, 199.0], [99.8, 211.0], [99.9, 230.0], [100.0, 360.0]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 5.0, "minX": 0.0, "maxY": 28043.0, "series": [{"data": [[0.0, 28043.0], [300.0, 5.0], [100.0, 2909.0], [200.0, 84.0]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 300.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 31041.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 31041.0, "series": [{"data": [[0.0, 31041.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 4.9E-324, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 127.94105263157894, "minX": 1.794891898E12, "maxY": 128.0, "series": [{"data": [[1.794891901E12, 128.0], [1.7948919E12, 128.0], [1.794891899E12, 128.0], [1.794891904E12, 128.0], [1.794891903E12, 128.0], [1.794891902E12, 128.0], [1.794891898E12, 128.0], [1.794891922E12, 128.0], [1.794891921E12, 128.0], [1.794891923E12, 127.94105263157894], [1.794891917E12, 128.0], [1.794891916E12, 128.0], [1.794891915E12, 128.0], [1.79489192E12, 128.0], [1.794891919E12, 128.0], [1.794891918E12, 128.0], [1.794891912E12, 128.0], [1.794891911E12, 128.0], [1.79489191E12, 128.0], [1.794891914E12, 128.0], [1.794891913E12, 128.0], [1.794891906E12, 128.0], [1.794891905E12, 128.0], [1.794891909E12, 128.0], [1.794891908E12, 128.0], [1.794891907E12, 128.0]], "isOverall": false, "label": "Log workload", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794891923E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 71.85723497549614, "minX": 121.0, "maxY": 135.0, "series": [{"data": [[128.0, 71.85723497549614], [123.0, 125.0], [122.0, 118.0], [121.0, 114.0], [127.0, 80.31250000000001], [126.0, 101.5], [125.0, 135.0]], "isOverall": false, "label": "read", "isController": false}, {"data": [[127.99819593440937, 71.87522953513056]], "isOverall": false, "label": "read-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 128.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 69090.0, "minX": 1.794891898E12, "maxY": 1.2086344E7, "series": [{"data": [[1.794891901E12, 1.1771324E7], [1.7948919E12, 1.2057516E7], [1.794891899E12, 1.1847986E7], [1.794891904E12, 1.1972018E7], [1.794891903E12, 1.1809481E7], [1.794891902E12, 1.2038307E7], [1.794891898E12, 2687995.0], [1.794891922E12, 1.1628489E7], [1.794891921E12, 1.162846E7], [1.794891923E12, 9054907.0], [1.794891917E12, 1.1867137E7], [1.794891916E12, 1.1838657E7], [1.794891915E12, 1.1800442E7], [1.79489192E12, 1.1628692E7], [1.794891919E12, 1.1323784E7], [1.794891918E12, 1.1609686E7], [1.794891912E12, 1.1857286E7], [1.794891911E12, 1.1761821E7], [1.79489191E12, 1.1990821E7], [1.794891914E12, 1.2010088E7], [1.794891913E12, 1.1828429E7], [1.794891906E12, 1.1876727E7], [1.794891905E12, 1.199114E7], [1.794891909E12, 1.1981492E7], [1.794891908E12, 1.1924242E7], [1.794891907E12, 1.2086344E7]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.794891901E12, 302575.0], [1.7948919E12, 309925.0], [1.794891899E12, 304535.0], [1.794891904E12, 307720.0], [1.794891903E12, 303555.0], [1.794891902E12, 309435.0], [1.794891898E12, 69090.0], [1.794891922E12, 298900.0], [1.794891921E12, 298900.0], [1.794891923E12, 232750.0], [1.794891917E12, 305025.0], [1.794891916E12, 304290.0], [1.794891915E12, 303310.0], [1.79489192E12, 298900.0], [1.794891919E12, 291060.0], [1.794891918E12, 298410.0], [1.794891912E12, 304780.0], [1.794891911E12, 302330.0], [1.79489191E12, 308210.0], [1.794891914E12, 308700.0], [1.794891913E12, 304045.0], [1.794891906E12, 305270.0], [1.794891905E12, 308210.0], [1.794891909E12, 307965.0], [1.794891908E12, 306495.0], [1.794891907E12, 310660.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794891923E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 63.8721023181456, "minX": 1.794891898E12, "maxY": 88.77441077441065, "series": [{"data": [[1.794891901E12, 71.79595141700405], [1.7948919E12, 69.0577075098814], [1.794891899E12, 71.13998390989526], [1.794891904E12, 70.75477707006364], [1.794891903E12, 68.90395480225978], [1.794891902E12, 76.16231195566124], [1.794891898E12, 68.24822695035465], [1.794891922E12, 78.62540983606547], [1.794891921E12, 73.6754098360655], [1.794891923E12, 73.8452631578948], [1.794891917E12, 73.12048192771081], [1.794891916E12, 71.89613526570054], [1.794891915E12, 70.78675282714063], [1.79489192E12, 81.92540983606546], [1.794891919E12, 88.77441077441065], [1.794891918E12, 76.70443349753697], [1.794891912E12, 71.58842443729891], [1.794891911E12, 68.78525121555926], [1.79489191E12, 66.30604133545313], [1.794891914E12, 68.74523809523805], [1.794891913E12, 74.87751813054003], [1.794891906E12, 68.97833065810615], [1.794891905E12, 66.7448330683625], [1.794891909E12, 66.05727923627691], [1.794891908E12, 63.8721023181456], [1.794891907E12, 66.59463722397489]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794891923E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 63.85371702637894, "minX": 1.794891898E12, "maxY": 88.73569023569023, "series": [{"data": [[1.794891901E12, 71.77975708502035], [1.7948919E12, 69.0300395256916], [1.794891899E12, 71.11423974255835], [1.794891904E12, 70.72133757961778], [1.794891903E12, 68.88377723970953], [1.794891902E12, 76.14726840855118], [1.794891898E12, 68.20212765957446], [1.794891922E12, 78.59918032786894], [1.794891921E12, 73.64918032786885], [1.794891923E12, 73.81894736842101], [1.794891917E12, 73.10200803212848], [1.794891916E12, 71.85748792270519], [1.794891915E12, 70.76817447495951], [1.79489192E12, 81.88442622950818], [1.794891919E12, 88.73569023569023], [1.794891918E12, 76.66420361247948], [1.794891912E12, 71.55466237942122], [1.794891911E12, 68.76256077795794], [1.79489191E12, 66.28616852146259], [1.794891914E12, 68.72063492063478], [1.794891913E12, 74.85656728444789], [1.794891906E12, 68.95024077046567], [1.794891905E12, 66.7273449920509], [1.794891909E12, 66.04136833731108], [1.794891908E12, 63.85371702637894], [1.794891907E12, 66.57334384858056]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794891923E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.0, "minX": 1.794891898E12, "maxY": 0.007154213036565972, "series": [{"data": [[1.794891901E12, 0.004858299595141707], [1.7948919E12, 0.005533596837944674], [1.794891899E12, 0.0024135156878519726], [1.794891904E12, 0.002388535031847137], [1.794891903E12, 0.005649717514124291], [1.794891902E12, 0.005542359461599371], [1.794891898E12, 0.0], [1.794891922E12, 0.0024590163934426253], [1.794891921E12, 0.003278688524590166], [1.794891923E12, 0.0031578947368421087], [1.794891917E12, 8.032128514056228E-4], [1.794891916E12, 8.051529790660229E-4], [1.794891915E12, 0.0024232633279483063], [1.79489192E12, 0.003278688524590168], [1.794891919E12, 0.004208754208754208], [1.794891918E12, 0.002463054187192119], [1.794891912E12, 0.004019292604501609], [1.794891911E12, 0.004862236628849275], [1.79489191E12, 0.007154213036565972], [1.794891914E12, 0.003174603174603179], [1.794891913E12, 0.005640612409347309], [1.794891906E12, 0.0016051364365971136], [1.794891905E12, 7.949125596184418E-4], [1.794891909E12, 0.005568814638027054], [1.794891908E12, 0.0023980815347721843], [1.794891907E12, 0.0015772870662460578]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794891923E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 4.0, "minX": 1.794891898E12, "maxY": 360.0, "series": [{"data": [[1.794891901E12, 163.0], [1.7948919E12, 183.0], [1.794891899E12, 183.0], [1.794891904E12, 253.0], [1.794891903E12, 255.0], [1.794891902E12, 211.0], [1.794891898E12, 180.0], [1.794891922E12, 360.0], [1.794891921E12, 271.0], [1.794891923E12, 242.0], [1.794891917E12, 194.0], [1.794891916E12, 201.0], [1.794891915E12, 199.0], [1.79489192E12, 292.0], [1.794891919E12, 318.0], [1.794891918E12, 356.0], [1.794891912E12, 273.0], [1.794891911E12, 216.0], [1.79489191E12, 217.0], [1.794891914E12, 278.0], [1.794891913E12, 209.0], [1.794891906E12, 234.0], [1.794891905E12, 225.0], [1.794891909E12, 264.0], [1.794891908E12, 214.0], [1.794891907E12, 220.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.794891901E12, 6.0], [1.7948919E12, 7.0], [1.794891899E12, 8.0], [1.794891904E12, 5.0], [1.794891903E12, 4.0], [1.794891902E12, 7.0], [1.794891898E12, 8.0], [1.794891922E12, 6.0], [1.794891921E12, 6.0], [1.794891923E12, 8.0], [1.794891917E12, 6.0], [1.794891916E12, 7.0], [1.794891915E12, 6.0], [1.79489192E12, 5.0], [1.794891919E12, 7.0], [1.794891918E12, 6.0], [1.794891912E12, 6.0], [1.794891911E12, 6.0], [1.79489191E12, 5.0], [1.794891914E12, 6.0], [1.794891913E12, 6.0], [1.794891906E12, 4.0], [1.794891905E12, 6.0], [1.794891909E12, 6.0], [1.794891908E12, 7.0], [1.794891907E12, 6.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.794891901E12, 88.0], [1.7948919E12, 87.0], [1.794891899E12, 87.0], [1.794891904E12, 88.29999999999995], [1.794891903E12, 95.0], [1.794891902E12, 93.0], [1.794891898E12, 87.70000000000002], [1.794891922E12, 113.90000000000009], [1.794891921E12, 124.90000000000009], [1.794891923E12, 117.89999999999998], [1.794891917E12, 92.0], [1.794891916E12, 91.0], [1.794891915E12, 103.50000000000068], [1.79489192E12, 128.60000000000036], [1.794891919E12, 124.00000000000136], [1.794891918E12, 115.40000000000055], [1.794891912E12, 87.0], [1.794891911E12, 95.0], [1.79489191E12, 102.0], [1.794891914E12, 89.0], [1.794891913E12, 94.0], [1.794891906E12, 86.0], [1.794891905E12, 89.10000000000014], [1.794891909E12, 80.0], [1.794891908E12, 92.39999999999986], [1.794891907E12, 83.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.794891901E12, 142.0], [1.7948919E12, 132.67999999999984], [1.794891899E12, 137.0], [1.794891904E12, 143.86000000000013], [1.794891903E12, 137.0], [1.794891902E12, 156.0], [1.794891898E12, 147.40000000000032], [1.794891922E12, 209.57999999999993], [1.794891921E12, 200.57999999999993], [1.794891923E12, 162.25000000000023], [1.794891917E12, 150.0], [1.794891916E12, 152.84999999999968], [1.794891915E12, 138.6099999999999], [1.79489192E12, 205.0], [1.794891919E12, 224.1099999999999], [1.794891918E12, 191.6199999999999], [1.794891912E12, 138.54999999999995], [1.794891911E12, 162.0], [1.79489191E12, 135.82000000000016], [1.794891914E12, 134.0], [1.794891913E12, 159.63999999999942], [1.794891906E12, 136.58999999999992], [1.794891905E12, 129.0], [1.794891909E12, 132.0], [1.794891908E12, 158.48000000000002], [1.794891907E12, 134.6199999999999]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.794891901E12, 71.0], [1.7948919E12, 69.0], [1.794891899E12, 70.0], [1.794891904E12, 70.0], [1.794891903E12, 69.0], [1.794891902E12, 76.0], [1.794891898E12, 70.5], [1.794891922E12, 78.0], [1.794891921E12, 72.0], [1.794891923E12, 72.0], [1.794891917E12, 73.0], [1.794891916E12, 73.0], [1.794891915E12, 70.0], [1.79489192E12, 81.0], [1.794891919E12, 88.0], [1.794891918E12, 75.0], [1.794891912E12, 71.0], [1.794891911E12, 68.0], [1.79489191E12, 65.0], [1.794891914E12, 68.0], [1.794891913E12, 74.0], [1.794891906E12, 68.0], [1.794891905E12, 66.0], [1.794891909E12, 66.0], [1.794891908E12, 63.0], [1.794891907E12, 66.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.794891901E12, 118.0], [1.7948919E12, 120.70000000000005], [1.794891899E12, 125.0], [1.794891904E12, 126.0], [1.794891903E12, 120.0], [1.794891902E12, 126.0], [1.794891898E12, 123.84999999999997], [1.794891922E12, 147.0], [1.794891921E12, 137.0], [1.794891923E12, 127.0], [1.794891917E12, 125.0], [1.794891916E12, 125.84999999999991], [1.794891915E12, 125.0], [1.79489192E12, 147.0], [1.794891919E12, 159.0], [1.794891918E12, 137.0], [1.794891912E12, 123.0], [1.794891911E12, 124.0], [1.79489191E12, 115.0], [1.794891914E12, 119.0], [1.794891913E12, 134.0], [1.794891906E12, 120.0], [1.794891905E12, 115.04999999999995], [1.794891909E12, 114.0], [1.794891908E12, 113.0], [1.794891907E12, 115.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794891923E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 63.0, "minX": 282.0, "maxY": 88.0, "series": [{"data": [[950.0, 72.0], [1188.0, 88.0], [1265.0, 69.0], [1243.0, 70.0], [1235.0, 71.0], [1234.0, 68.0], [1263.0, 76.0], [1260.0, 68.0], [1239.0, 69.0], [1238.0, 70.0], [1241.0, 74.0], [1242.0, 73.0], [1256.0, 70.0], [1258.0, 66.0], [1246.0, 68.0], [1218.0, 75.0], [1220.0, 78.0], [1244.0, 71.0], [1245.0, 73.0], [1268.0, 66.0], [1251.0, 63.0], [1257.0, 66.0], [282.0, 70.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1268.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 63.0, "minX": 282.0, "maxY": 88.0, "series": [{"data": [[950.0, 72.0], [1188.0, 88.0], [1265.0, 69.0], [1243.0, 70.0], [1235.0, 71.0], [1234.0, 68.0], [1263.0, 76.0], [1260.0, 68.0], [1239.0, 69.0], [1238.0, 70.0], [1241.0, 74.0], [1242.0, 73.0], [1256.0, 70.0], [1258.0, 66.0], [1246.0, 68.0], [1218.0, 75.0], [1220.0, 78.0], [1244.0, 71.0], [1245.0, 73.0], [1268.0, 66.0], [1251.0, 63.0], [1257.0, 66.0], [282.0, 70.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1268.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 370.0, "minX": 1.794891898E12, "maxY": 1264.0, "series": [{"data": [[1.794891901E12, 1254.0], [1.7948919E12, 1255.0], [1.794891899E12, 1248.0], [1.794891904E12, 1250.0], [1.794891903E12, 1242.0], [1.794891902E12, 1246.0], [1.794891898E12, 370.0], [1.794891922E12, 1215.0], [1.794891921E12, 1217.0], [1.794891923E12, 864.0], [1.794891917E12, 1242.0], [1.794891916E12, 1243.0], [1.794891915E12, 1255.0], [1.79489192E12, 1209.0], [1.794891919E12, 1184.0], [1.794891918E12, 1227.0], [1.794891912E12, 1253.0], [1.794891911E12, 1239.0], [1.79489191E12, 1264.0], [1.794891914E12, 1255.0], [1.794891913E12, 1237.0], [1.794891906E12, 1255.0], [1.794891905E12, 1256.0], [1.794891909E12, 1253.0], [1.794891908E12, 1257.0], [1.794891907E12, 1251.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794891923E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 282.0, "minX": 1.794891898E12, "maxY": 1268.0, "series": [{"data": [[1.794891901E12, 1235.0], [1.7948919E12, 1265.0], [1.794891899E12, 1243.0], [1.794891904E12, 1256.0], [1.794891903E12, 1239.0], [1.794891902E12, 1263.0], [1.794891898E12, 282.0], [1.794891922E12, 1220.0], [1.794891921E12, 1220.0], [1.794891923E12, 950.0], [1.794891917E12, 1245.0], [1.794891916E12, 1242.0], [1.794891915E12, 1238.0], [1.79489192E12, 1220.0], [1.794891919E12, 1188.0], [1.794891918E12, 1218.0], [1.794891912E12, 1244.0], [1.794891911E12, 1234.0], [1.79489191E12, 1258.0], [1.794891914E12, 1260.0], [1.794891913E12, 1241.0], [1.794891906E12, 1246.0], [1.794891905E12, 1258.0], [1.794891909E12, 1257.0], [1.794891908E12, 1251.0], [1.794891907E12, 1268.0]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794891923E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 282.0, "minX": 1.794891898E12, "maxY": 1268.0, "series": [{"data": [[1.794891901E12, 1235.0], [1.7948919E12, 1265.0], [1.794891899E12, 1243.0], [1.794891904E12, 1256.0], [1.794891903E12, 1239.0], [1.794891902E12, 1263.0], [1.794891898E12, 282.0], [1.794891922E12, 1220.0], [1.794891921E12, 1220.0], [1.794891923E12, 950.0], [1.794891917E12, 1245.0], [1.794891916E12, 1242.0], [1.794891915E12, 1238.0], [1.79489192E12, 1220.0], [1.794891919E12, 1188.0], [1.794891918E12, 1218.0], [1.794891912E12, 1244.0], [1.794891911E12, 1234.0], [1.79489191E12, 1258.0], [1.794891914E12, 1260.0], [1.794891913E12, 1241.0], [1.794891906E12, 1246.0], [1.794891905E12, 1258.0], [1.794891909E12, 1257.0], [1.794891908E12, 1251.0], [1.794891907E12, 1268.0]], "isOverall": false, "label": "read-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794891923E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 282.0, "minX": 1.794891898E12, "maxY": 1268.0, "series": [{"data": [[1.794891901E12, 1235.0], [1.7948919E12, 1265.0], [1.794891899E12, 1243.0], [1.794891904E12, 1256.0], [1.794891903E12, 1239.0], [1.794891902E12, 1263.0], [1.794891898E12, 282.0], [1.794891922E12, 1220.0], [1.794891921E12, 1220.0], [1.794891923E12, 950.0], [1.794891917E12, 1245.0], [1.794891916E12, 1242.0], [1.794891915E12, 1238.0], [1.79489192E12, 1220.0], [1.794891919E12, 1188.0], [1.794891918E12, 1218.0], [1.794891912E12, 1244.0], [1.794891911E12, 1234.0], [1.79489191E12, 1258.0], [1.794891914E12, 1260.0], [1.794891913E12, 1241.0], [1.794891906E12, 1246.0], [1.794891905E12, 1258.0], [1.794891909E12, 1257.0], [1.794891908E12, 1251.0], [1.794891907E12, 1268.0]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794891923E12, "title": "Total Transactions Per Second"}},
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

