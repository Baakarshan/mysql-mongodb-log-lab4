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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 516.0, "series": [{"data": [[0.0, 1.0], [0.1, 2.0], [0.2, 2.0], [0.3, 2.0], [0.4, 2.0], [0.5, 2.0], [0.6, 2.0], [0.7, 2.0], [0.8, 2.0], [0.9, 2.0], [1.0, 2.0], [1.1, 2.0], [1.2, 2.0], [1.3, 2.0], [1.4, 3.0], [1.5, 3.0], [1.6, 3.0], [1.7, 3.0], [1.8, 3.0], [1.9, 3.0], [2.0, 3.0], [2.1, 3.0], [2.2, 3.0], [2.3, 3.0], [2.4, 3.0], [2.5, 3.0], [2.6, 3.0], [2.7, 3.0], [2.8, 3.0], [2.9, 3.0], [3.0, 3.0], [3.1, 3.0], [3.2, 3.0], [3.3, 3.0], [3.4, 3.0], [3.5, 3.0], [3.6, 3.0], [3.7, 3.0], [3.8, 3.0], [3.9, 3.0], [4.0, 3.0], [4.1, 3.0], [4.2, 3.0], [4.3, 3.0], [4.4, 3.0], [4.5, 3.0], [4.6, 3.0], [4.7, 4.0], [4.8, 4.0], [4.9, 4.0], [5.0, 4.0], [5.1, 4.0], [5.2, 4.0], [5.3, 4.0], [5.4, 4.0], [5.5, 4.0], [5.6, 4.0], [5.7, 4.0], [5.8, 4.0], [5.9, 4.0], [6.0, 4.0], [6.1, 4.0], [6.2, 4.0], [6.3, 4.0], [6.4, 4.0], [6.5, 4.0], [6.6, 4.0], [6.7, 4.0], [6.8, 4.0], [6.9, 4.0], [7.0, 4.0], [7.1, 4.0], [7.2, 4.0], [7.3, 4.0], [7.4, 4.0], [7.5, 4.0], [7.6, 4.0], [7.7, 4.0], [7.8, 4.0], [7.9, 4.0], [8.0, 4.0], [8.1, 4.0], [8.2, 4.0], [8.3, 5.0], [8.4, 5.0], [8.5, 5.0], [8.6, 5.0], [8.7, 5.0], [8.8, 5.0], [8.9, 5.0], [9.0, 5.0], [9.1, 5.0], [9.2, 5.0], [9.3, 5.0], [9.4, 5.0], [9.5, 5.0], [9.6, 5.0], [9.7, 5.0], [9.8, 5.0], [9.9, 5.0], [10.0, 5.0], [10.1, 5.0], [10.2, 5.0], [10.3, 5.0], [10.4, 5.0], [10.5, 5.0], [10.6, 5.0], [10.7, 5.0], [10.8, 5.0], [10.9, 5.0], [11.0, 5.0], [11.1, 5.0], [11.2, 5.0], [11.3, 5.0], [11.4, 5.0], [11.5, 5.0], [11.6, 5.0], [11.7, 6.0], [11.8, 6.0], [11.9, 6.0], [12.0, 6.0], [12.1, 6.0], [12.2, 6.0], [12.3, 6.0], [12.4, 6.0], [12.5, 6.0], [12.6, 6.0], [12.7, 6.0], [12.8, 6.0], [12.9, 6.0], [13.0, 6.0], [13.1, 6.0], [13.2, 6.0], [13.3, 6.0], [13.4, 6.0], [13.5, 6.0], [13.6, 6.0], [13.7, 6.0], [13.8, 6.0], [13.9, 6.0], [14.0, 6.0], [14.1, 6.0], [14.2, 6.0], [14.3, 6.0], [14.4, 6.0], [14.5, 6.0], [14.6, 6.0], [14.7, 6.0], [14.8, 6.0], [14.9, 6.0], [15.0, 6.0], [15.1, 7.0], [15.2, 7.0], [15.3, 7.0], [15.4, 7.0], [15.5, 7.0], [15.6, 7.0], [15.7, 7.0], [15.8, 7.0], [15.9, 7.0], [16.0, 7.0], [16.1, 7.0], [16.2, 7.0], [16.3, 7.0], [16.4, 7.0], [16.5, 7.0], [16.6, 7.0], [16.7, 7.0], [16.8, 7.0], [16.9, 7.0], [17.0, 7.0], [17.1, 7.0], [17.2, 7.0], [17.3, 7.0], [17.4, 7.0], [17.5, 7.0], [17.6, 7.0], [17.7, 7.0], [17.8, 7.0], [17.9, 7.0], [18.0, 7.0], [18.1, 7.0], [18.2, 7.0], [18.3, 8.0], [18.4, 8.0], [18.5, 8.0], [18.6, 8.0], [18.7, 8.0], [18.8, 8.0], [18.9, 8.0], [19.0, 8.0], [19.1, 8.0], [19.2, 8.0], [19.3, 8.0], [19.4, 8.0], [19.5, 8.0], [19.6, 8.0], [19.7, 8.0], [19.8, 8.0], [19.9, 8.0], [20.0, 8.0], [20.1, 8.0], [20.2, 8.0], [20.3, 8.0], [20.4, 8.0], [20.5, 8.0], [20.6, 8.0], [20.7, 8.0], [20.8, 8.0], [20.9, 8.0], [21.0, 8.0], [21.1, 8.0], [21.2, 8.0], [21.3, 8.0], [21.4, 8.0], [21.5, 9.0], [21.6, 9.0], [21.7, 9.0], [21.8, 9.0], [21.9, 9.0], [22.0, 9.0], [22.1, 9.0], [22.2, 9.0], [22.3, 9.0], [22.4, 9.0], [22.5, 9.0], [22.6, 9.0], [22.7, 9.0], [22.8, 9.0], [22.9, 9.0], [23.0, 9.0], [23.1, 9.0], [23.2, 9.0], [23.3, 9.0], [23.4, 9.0], [23.5, 9.0], [23.6, 9.0], [23.7, 9.0], [23.8, 9.0], [23.9, 9.0], [24.0, 9.0], [24.1, 9.0], [24.2, 9.0], [24.3, 9.0], [24.4, 9.0], [24.5, 9.0], [24.6, 9.0], [24.7, 9.0], [24.8, 10.0], [24.9, 10.0], [25.0, 10.0], [25.1, 10.0], [25.2, 10.0], [25.3, 10.0], [25.4, 10.0], [25.5, 10.0], [25.6, 10.0], [25.7, 10.0], [25.8, 10.0], [25.9, 10.0], [26.0, 10.0], [26.1, 10.0], [26.2, 10.0], [26.3, 10.0], [26.4, 10.0], [26.5, 10.0], [26.6, 10.0], [26.7, 10.0], [26.8, 10.0], [26.9, 10.0], [27.0, 10.0], [27.1, 10.0], [27.2, 10.0], [27.3, 10.0], [27.4, 10.0], [27.5, 10.0], [27.6, 10.0], [27.7, 10.0], [27.8, 10.0], [27.9, 10.0], [28.0, 11.0], [28.1, 11.0], [28.2, 11.0], [28.3, 11.0], [28.4, 11.0], [28.5, 11.0], [28.6, 11.0], [28.7, 11.0], [28.8, 11.0], [28.9, 11.0], [29.0, 11.0], [29.1, 11.0], [29.2, 11.0], [29.3, 11.0], [29.4, 11.0], [29.5, 11.0], [29.6, 11.0], [29.7, 11.0], [29.8, 11.0], [29.9, 11.0], [30.0, 11.0], [30.1, 11.0], [30.2, 11.0], [30.3, 11.0], [30.4, 11.0], [30.5, 11.0], [30.6, 11.0], [30.7, 11.0], [30.8, 11.0], [30.9, 11.0], [31.0, 12.0], [31.1, 12.0], [31.2, 12.0], [31.3, 12.0], [31.4, 12.0], [31.5, 12.0], [31.6, 12.0], [31.7, 12.0], [31.8, 12.0], [31.9, 12.0], [32.0, 12.0], [32.1, 12.0], [32.2, 12.0], [32.3, 12.0], [32.4, 12.0], [32.5, 12.0], [32.6, 12.0], [32.7, 12.0], [32.8, 12.0], [32.9, 12.0], [33.0, 12.0], [33.1, 12.0], [33.2, 12.0], [33.3, 12.0], [33.4, 12.0], [33.5, 12.0], [33.6, 12.0], [33.7, 12.0], [33.8, 12.0], [33.9, 13.0], [34.0, 13.0], [34.1, 13.0], [34.2, 13.0], [34.3, 13.0], [34.4, 13.0], [34.5, 13.0], [34.6, 13.0], [34.7, 13.0], [34.8, 13.0], [34.9, 13.0], [35.0, 13.0], [35.1, 13.0], [35.2, 13.0], [35.3, 13.0], [35.4, 13.0], [35.5, 13.0], [35.6, 13.0], [35.7, 13.0], [35.8, 13.0], [35.9, 13.0], [36.0, 13.0], [36.1, 13.0], [36.2, 13.0], [36.3, 13.0], [36.4, 13.0], [36.5, 13.0], [36.6, 13.0], [36.7, 13.0], [36.8, 14.0], [36.9, 14.0], [37.0, 14.0], [37.1, 14.0], [37.2, 14.0], [37.3, 14.0], [37.4, 14.0], [37.5, 14.0], [37.6, 14.0], [37.7, 14.0], [37.8, 14.0], [37.9, 14.0], [38.0, 14.0], [38.1, 14.0], [38.2, 14.0], [38.3, 14.0], [38.4, 14.0], [38.5, 14.0], [38.6, 14.0], [38.7, 14.0], [38.8, 14.0], [38.9, 14.0], [39.0, 14.0], [39.1, 14.0], [39.2, 14.0], [39.3, 14.0], [39.4, 14.0], [39.5, 14.0], [39.6, 15.0], [39.7, 15.0], [39.8, 15.0], [39.9, 15.0], [40.0, 15.0], [40.1, 15.0], [40.2, 15.0], [40.3, 15.0], [40.4, 15.0], [40.5, 15.0], [40.6, 15.0], [40.7, 15.0], [40.8, 15.0], [40.9, 15.0], [41.0, 15.0], [41.1, 15.0], [41.2, 15.0], [41.3, 15.0], [41.4, 15.0], [41.5, 15.0], [41.6, 15.0], [41.7, 15.0], [41.8, 15.0], [41.9, 15.0], [42.0, 15.0], [42.1, 15.0], [42.2, 15.0], [42.3, 16.0], [42.4, 16.0], [42.5, 16.0], [42.6, 16.0], [42.7, 16.0], [42.8, 16.0], [42.9, 16.0], [43.0, 16.0], [43.1, 16.0], [43.2, 16.0], [43.3, 16.0], [43.4, 16.0], [43.5, 16.0], [43.6, 16.0], [43.7, 16.0], [43.8, 16.0], [43.9, 16.0], [44.0, 16.0], [44.1, 16.0], [44.2, 16.0], [44.3, 16.0], [44.4, 16.0], [44.5, 16.0], [44.6, 16.0], [44.7, 16.0], [44.8, 16.0], [44.9, 16.0], [45.0, 17.0], [45.1, 17.0], [45.2, 17.0], [45.3, 17.0], [45.4, 17.0], [45.5, 17.0], [45.6, 17.0], [45.7, 17.0], [45.8, 17.0], [45.9, 17.0], [46.0, 17.0], [46.1, 17.0], [46.2, 17.0], [46.3, 17.0], [46.4, 17.0], [46.5, 17.0], [46.6, 17.0], [46.7, 17.0], [46.8, 17.0], [46.9, 17.0], [47.0, 17.0], [47.1, 17.0], [47.2, 17.0], [47.3, 17.0], [47.4, 17.0], [47.5, 17.0], [47.6, 18.0], [47.7, 18.0], [47.8, 18.0], [47.9, 18.0], [48.0, 18.0], [48.1, 18.0], [48.2, 18.0], [48.3, 18.0], [48.4, 18.0], [48.5, 18.0], [48.6, 18.0], [48.7, 18.0], [48.8, 18.0], [48.9, 18.0], [49.0, 18.0], [49.1, 18.0], [49.2, 18.0], [49.3, 18.0], [49.4, 18.0], [49.5, 18.0], [49.6, 18.0], [49.7, 18.0], [49.8, 18.0], [49.9, 18.0], [50.0, 19.0], [50.1, 19.0], [50.2, 19.0], [50.3, 19.0], [50.4, 19.0], [50.5, 19.0], [50.6, 19.0], [50.7, 19.0], [50.8, 19.0], [50.9, 19.0], [51.0, 19.0], [51.1, 19.0], [51.2, 19.0], [51.3, 19.0], [51.4, 19.0], [51.5, 19.0], [51.6, 19.0], [51.7, 19.0], [51.8, 19.0], [51.9, 19.0], [52.0, 19.0], [52.1, 19.0], [52.2, 19.0], [52.3, 19.0], [52.4, 20.0], [52.5, 20.0], [52.6, 20.0], [52.7, 20.0], [52.8, 20.0], [52.9, 20.0], [53.0, 20.0], [53.1, 20.0], [53.2, 20.0], [53.3, 20.0], [53.4, 20.0], [53.5, 20.0], [53.6, 20.0], [53.7, 20.0], [53.8, 20.0], [53.9, 20.0], [54.0, 20.0], [54.1, 20.0], [54.2, 20.0], [54.3, 20.0], [54.4, 20.0], [54.5, 20.0], [54.6, 21.0], [54.7, 21.0], [54.8, 21.0], [54.9, 21.0], [55.0, 21.0], [55.1, 21.0], [55.2, 21.0], [55.3, 21.0], [55.4, 21.0], [55.5, 21.0], [55.6, 21.0], [55.7, 21.0], [55.8, 21.0], [55.9, 21.0], [56.0, 21.0], [56.1, 21.0], [56.2, 21.0], [56.3, 21.0], [56.4, 21.0], [56.5, 21.0], [56.6, 21.0], [56.7, 22.0], [56.8, 22.0], [56.9, 22.0], [57.0, 22.0], [57.1, 22.0], [57.2, 22.0], [57.3, 22.0], [57.4, 22.0], [57.5, 22.0], [57.6, 22.0], [57.7, 22.0], [57.8, 22.0], [57.9, 22.0], [58.0, 22.0], [58.1, 22.0], [58.2, 22.0], [58.3, 22.0], [58.4, 22.0], [58.5, 22.0], [58.6, 22.0], [58.7, 22.0], [58.8, 23.0], [58.9, 23.0], [59.0, 23.0], [59.1, 23.0], [59.2, 23.0], [59.3, 23.0], [59.4, 23.0], [59.5, 23.0], [59.6, 23.0], [59.7, 23.0], [59.8, 23.0], [59.9, 23.0], [60.0, 23.0], [60.1, 23.0], [60.2, 23.0], [60.3, 23.0], [60.4, 23.0], [60.5, 23.0], [60.6, 23.0], [60.7, 23.0], [60.8, 24.0], [60.9, 24.0], [61.0, 24.0], [61.1, 24.0], [61.2, 24.0], [61.3, 24.0], [61.4, 24.0], [61.5, 24.0], [61.6, 24.0], [61.7, 24.0], [61.8, 24.0], [61.9, 24.0], [62.0, 24.0], [62.1, 24.0], [62.2, 24.0], [62.3, 24.0], [62.4, 24.0], [62.5, 24.0], [62.6, 24.0], [62.7, 25.0], [62.8, 25.0], [62.9, 25.0], [63.0, 25.0], [63.1, 25.0], [63.2, 25.0], [63.3, 25.0], [63.4, 25.0], [63.5, 25.0], [63.6, 25.0], [63.7, 25.0], [63.8, 25.0], [63.9, 25.0], [64.0, 25.0], [64.1, 25.0], [64.2, 25.0], [64.3, 25.0], [64.4, 25.0], [64.5, 25.0], [64.6, 26.0], [64.7, 26.0], [64.8, 26.0], [64.9, 26.0], [65.0, 26.0], [65.1, 26.0], [65.2, 26.0], [65.3, 26.0], [65.4, 26.0], [65.5, 26.0], [65.6, 26.0], [65.7, 26.0], [65.8, 26.0], [65.9, 26.0], [66.0, 26.0], [66.1, 26.0], [66.2, 27.0], [66.3, 27.0], [66.4, 27.0], [66.5, 27.0], [66.6, 27.0], [66.7, 27.0], [66.8, 27.0], [66.9, 27.0], [67.0, 27.0], [67.1, 27.0], [67.2, 27.0], [67.3, 27.0], [67.4, 27.0], [67.5, 27.0], [67.6, 27.0], [67.7, 27.0], [67.8, 27.0], [67.9, 27.0], [68.0, 28.0], [68.1, 28.0], [68.2, 28.0], [68.3, 28.0], [68.4, 28.0], [68.5, 28.0], [68.6, 28.0], [68.7, 28.0], [68.8, 28.0], [68.9, 28.0], [69.0, 28.0], [69.1, 28.0], [69.2, 28.0], [69.3, 28.0], [69.4, 28.0], [69.5, 28.0], [69.6, 29.0], [69.7, 29.0], [69.8, 29.0], [69.9, 29.0], [70.0, 29.0], [70.1, 29.0], [70.2, 29.0], [70.3, 29.0], [70.4, 29.0], [70.5, 29.0], [70.6, 29.0], [70.7, 29.0], [70.8, 29.0], [70.9, 29.0], [71.0, 29.0], [71.1, 30.0], [71.2, 30.0], [71.3, 30.0], [71.4, 30.0], [71.5, 30.0], [71.6, 30.0], [71.7, 30.0], [71.8, 30.0], [71.9, 30.0], [72.0, 30.0], [72.1, 30.0], [72.2, 30.0], [72.3, 30.0], [72.4, 30.0], [72.5, 30.0], [72.6, 31.0], [72.7, 31.0], [72.8, 31.0], [72.9, 31.0], [73.0, 31.0], [73.1, 31.0], [73.2, 31.0], [73.3, 31.0], [73.4, 31.0], [73.5, 31.0], [73.6, 31.0], [73.7, 31.0], [73.8, 31.0], [73.9, 32.0], [74.0, 32.0], [74.1, 32.0], [74.2, 32.0], [74.3, 32.0], [74.4, 32.0], [74.5, 32.0], [74.6, 32.0], [74.7, 32.0], [74.8, 32.0], [74.9, 32.0], [75.0, 32.0], [75.1, 33.0], [75.2, 33.0], [75.3, 33.0], [75.4, 33.0], [75.5, 33.0], [75.6, 33.0], [75.7, 33.0], [75.8, 33.0], [75.9, 33.0], [76.0, 33.0], [76.1, 33.0], [76.2, 33.0], [76.3, 33.0], [76.4, 34.0], [76.5, 34.0], [76.6, 34.0], [76.7, 34.0], [76.8, 34.0], [76.9, 34.0], [77.0, 34.0], [77.1, 34.0], [77.2, 34.0], [77.3, 34.0], [77.4, 34.0], [77.5, 35.0], [77.6, 35.0], [77.7, 35.0], [77.8, 35.0], [77.9, 35.0], [78.0, 35.0], [78.1, 35.0], [78.2, 35.0], [78.3, 35.0], [78.4, 35.0], [78.5, 35.0], [78.6, 36.0], [78.7, 36.0], [78.8, 36.0], [78.9, 36.0], [79.0, 36.0], [79.1, 36.0], [79.2, 36.0], [79.3, 36.0], [79.4, 36.0], [79.5, 36.0], [79.6, 37.0], [79.7, 37.0], [79.8, 37.0], [79.9, 37.0], [80.0, 37.0], [80.1, 37.0], [80.2, 37.0], [80.3, 37.0], [80.4, 37.0], [80.5, 38.0], [80.6, 38.0], [80.7, 38.0], [80.8, 38.0], [80.9, 38.0], [81.0, 38.0], [81.1, 38.0], [81.2, 38.0], [81.3, 38.0], [81.4, 39.0], [81.5, 39.0], [81.6, 39.0], [81.7, 39.0], [81.8, 39.0], [81.9, 39.0], [82.0, 39.0], [82.1, 39.0], [82.2, 40.0], [82.3, 40.0], [82.4, 40.0], [82.5, 40.0], [82.6, 40.0], [82.7, 40.0], [82.8, 40.0], [82.9, 40.0], [83.0, 41.0], [83.1, 41.0], [83.2, 41.0], [83.3, 41.0], [83.4, 41.0], [83.5, 41.0], [83.6, 41.0], [83.7, 42.0], [83.8, 42.0], [83.9, 42.0], [84.0, 42.0], [84.1, 42.0], [84.2, 42.0], [84.3, 42.0], [84.4, 42.0], [84.5, 43.0], [84.6, 43.0], [84.7, 43.0], [84.8, 43.0], [84.9, 43.0], [85.0, 43.0], [85.1, 44.0], [85.2, 44.0], [85.3, 44.0], [85.4, 44.0], [85.5, 44.0], [85.6, 44.0], [85.7, 45.0], [85.8, 45.0], [85.9, 45.0], [86.0, 45.0], [86.1, 45.0], [86.2, 45.0], [86.3, 46.0], [86.4, 46.0], [86.5, 46.0], [86.6, 46.0], [86.7, 46.0], [86.8, 46.0], [86.9, 47.0], [87.0, 47.0], [87.1, 47.0], [87.2, 47.0], [87.3, 47.0], [87.4, 48.0], [87.5, 48.0], [87.6, 48.0], [87.7, 48.0], [87.8, 48.0], [87.9, 49.0], [88.0, 49.0], [88.1, 49.0], [88.2, 49.0], [88.3, 49.0], [88.4, 50.0], [88.5, 50.0], [88.6, 50.0], [88.7, 50.0], [88.8, 50.0], [88.9, 51.0], [89.0, 51.0], [89.1, 51.0], [89.2, 51.0], [89.3, 52.0], [89.4, 52.0], [89.5, 52.0], [89.6, 52.0], [89.7, 53.0], [89.8, 53.0], [89.9, 53.0], [90.0, 53.0], [90.1, 54.0], [90.2, 54.0], [90.3, 54.0], [90.4, 54.0], [90.5, 55.0], [90.6, 55.0], [90.7, 55.0], [90.8, 56.0], [90.9, 56.0], [91.0, 56.0], [91.1, 56.0], [91.2, 57.0], [91.3, 57.0], [91.4, 57.0], [91.5, 58.0], [91.6, 58.0], [91.7, 58.0], [91.8, 58.0], [91.9, 59.0], [92.0, 59.0], [92.1, 59.0], [92.2, 60.0], [92.3, 60.0], [92.4, 60.0], [92.5, 61.0], [92.6, 61.0], [92.7, 61.0], [92.8, 62.0], [92.9, 62.0], [93.0, 62.0], [93.1, 63.0], [93.2, 63.0], [93.3, 63.0], [93.4, 64.0], [93.5, 64.0], [93.6, 64.0], [93.7, 65.0], [93.8, 65.0], [93.9, 66.0], [94.0, 66.0], [94.1, 66.0], [94.2, 67.0], [94.3, 67.0], [94.4, 68.0], [94.5, 68.0], [94.6, 69.0], [94.7, 69.0], [94.8, 70.0], [94.9, 70.0], [95.0, 71.0], [95.1, 71.0], [95.2, 72.0], [95.3, 72.0], [95.4, 73.0], [95.5, 73.0], [95.6, 74.0], [95.7, 74.0], [95.8, 75.0], [95.9, 75.0], [96.0, 76.0], [96.1, 76.0], [96.2, 77.0], [96.3, 78.0], [96.4, 79.0], [96.5, 79.0], [96.6, 80.0], [96.7, 81.0], [96.8, 82.0], [96.9, 83.0], [97.0, 84.0], [97.1, 85.0], [97.2, 86.0], [97.3, 87.0], [97.4, 88.0], [97.5, 89.0], [97.6, 90.0], [97.7, 91.0], [97.8, 92.0], [97.9, 94.0], [98.0, 95.0], [98.1, 96.0], [98.2, 98.0], [98.3, 100.0], [98.4, 102.0], [98.5, 104.0], [98.6, 106.0], [98.7, 109.0], [98.8, 112.0], [98.9, 115.0], [99.0, 118.0], [99.1, 121.0], [99.2, 125.0], [99.3, 129.0], [99.4, 134.0], [99.5, 140.0], [99.6, 149.0], [99.7, 160.0], [99.8, 182.0], [99.9, 235.0], [100.0, 516.0]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 84963.0, "series": [{"data": [[0.0, 84963.0], [300.0, 14.0], [100.0, 1342.0], [200.0, 117.0], [500.0, 1.0]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 500.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 1.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 86436.0, "series": [{"data": [[0.0, 86436.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 1.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 1.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 166.442015786278, "minX": 1.794897515E12, "maxY": 384.0, "series": [{"data": [[1.794897539E12, 384.0], [1.79489754E12, 383.921859545005], [1.794897538E12, 384.0], [1.794897537E12, 384.0], [1.794897519E12, 202.3079821856803], [1.79489752E12, 212.54889484259874], [1.794897518E12, 193.16151934682298], [1.794897517E12, 179.99475458973384], [1.794897515E12, 166.442015786278], [1.794897516E12, 172.93778979907268], [1.794897525E12, 303.703378192804], [1.794897523E12, 257.16087751371094], [1.794897524E12, 287.6334649256005], [1.794897522E12, 234.54837712519338], [1.794897521E12, 227.7403939296097], [1.79489753E12, 384.0], [1.794897529E12, 384.0], [1.794897527E12, 379.144225651943], [1.794897528E12, 384.0], [1.794897526E12, 335.1003432796411], [1.794897535E12, 384.0], [1.794897536E12, 384.0], [1.794897534E12, 384.0], [1.794897533E12, 384.0], [1.794897531E12, 384.0], [1.794897532E12, 384.0]], "isOverall": false, "label": "Log workload", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.79489754E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 2.3333333333333335, "minX": 165.0, "maxY": 113.75, "series": [{"data": [[165.0, 22.246153846153845], [166.0, 25.08958130477119], [167.0, 25.709779179810706], [168.0, 16.106442577030798], [169.0, 6.25], [170.0, 4.333333333333335], [171.0, 6.414893617021277], [172.0, 21.560674157303378], [173.0, 5.2727272727272725], [174.0, 23.744913928012497], [175.0, 30.987654320987648], [176.0, 20.192028985507235], [177.0, 39.75406504065038], [178.0, 15.686274509803924], [179.0, 25.433333333333348], [180.0, 22.99166666666666], [181.0, 22.2], [182.0, 30.244755244755236], [183.0, 34.43708609271521], [184.0, 8.12345679012346], [185.0, 27.781249999999975], [186.0, 30.149122807017534], [189.0, 8.0], [190.0, 9.25], [191.0, 10.2], [192.0, 12.0], [193.0, 11.322580645161288], [194.0, 4.0], [195.0, 16.604751619870417], [196.0, 28.539792387543255], [197.0, 15.151589242053788], [198.0, 9.761904761904765], [199.0, 14.333333333333332], [200.0, 30.700598802395216], [201.0, 22.445182724252497], [202.0, 50.419999999999995], [203.0, 18.93991416309014], [206.0, 7.0], [207.0, 17.0], [208.0, 26.120218579234987], [209.0, 32.20772303595209], [210.0, 3.0], [211.0, 16.84444444444445], [212.0, 31.18629343629342], [213.0, 38.93632958801505], [214.0, 55.833333333333336], [223.0, 58.869565217391305], [224.0, 37.849999999999994], [225.0, 18.81607142857143], [226.0, 16.838983050847474], [227.0, 21.365853658536583], [228.0, 31.077619663648143], [229.0, 22.668338907469366], [230.0, 33.57142857142858], [231.0, 23.425781249999996], [232.0, 19.314415437003408], [233.0, 11.6], [234.0, 11.0], [235.0, 21.5], [236.0, 28.595628415300542], [238.0, 26.93710691823899], [239.0, 24.583333333333332], [240.0, 24.11655011655013], [241.0, 25.855670103092773], [242.0, 7.036231884057971], [243.0, 5.333333333333333], [244.0, 14.1], [245.0, 21.333333333333332], [246.0, 12.0], [247.0, 24.095327102803736], [248.0, 60.300000000000004], [249.0, 29.114754098360656], [250.0, 32.88281250000001], [251.0, 22.666666666666668], [252.0, 14.4], [253.0, 24.0], [254.0, 32.0], [255.0, 8.0], [257.0, 7.0], [256.0, 8.75], [258.0, 6.333333333333333], [259.0, 9.200000000000001], [260.0, 11.5], [261.0, 8.166666666666668], [262.0, 14.0], [263.0, 16.0], [264.0, 13.0], [270.0, 16.0], [271.0, 20.5], [268.0, 16.5], [269.0, 15.5], [265.0, 17.0], [266.0, 19.5], [267.0, 16.0], [273.0, 56.64705882352941], [272.0, 13.0], [275.0, 22.61278195488723], [284.0, 33.80000000000002], [285.0, 35.223443223443226], [286.0, 19.133333333333336], [287.0, 21.937500000000004], [276.0, 18.130653266331677], [277.0, 10.848635235732011], [278.0, 24.19949494949495], [279.0, 29.89655172413793], [280.0, 27.045454545454547], [281.0, 34.666666666666664], [282.0, 42.940000000000005], [283.0, 43.34751773049644], [289.0, 42.23809523809524], [288.0, 26.93548387096774], [290.0, 49.000000000000036], [291.0, 15.194630872483222], [292.0, 17.50000000000001], [293.0, 19.834482758620688], [294.0, 19.142857142857142], [295.0, 27.4], [296.0, 35.870129870129865], [302.0, 24.846153846153847], [303.0, 23.555555555555554], [300.0, 23.318181818181813], [301.0, 35.3], [297.0, 30.465364120781476], [298.0, 21.74712643678163], [299.0, 11.34857142857143], [306.0, 44.451171874999986], [304.0, 29.330578512396688], [307.0, 28.470588235294116], [316.0, 27.772277227722764], [317.0, 22.18181818181818], [318.0, 26.363636363636363], [319.0, 15.90909090909091], [308.0, 28.459459459459467], [309.0, 32.19277108433736], [311.0, 42.242718446601955], [312.0, 48.78688524590162], [313.0, 27.303797468354425], [314.0, 33.81960784313725], [315.0, 26.200000000000003], [321.0, 26.281249999999996], [320.0, 19.142857142857153], [322.0, 16.6], [323.0, 27.87058823529412], [324.0, 27.26197183098591], [325.0, 21.617021276595747], [326.0, 21.553097345132723], [327.0, 22.51155115511549], [328.0, 25.119402985074625], [332.0, 37.13541666666667], [334.0, 34.0], [329.0, 17.062499999999996], [330.0, 23.250000000000004], [331.0, 27.411764705882355], [338.0, 40.97674418604651], [337.0, 48.0], [339.0, 43.57142857142857], [348.0, 39.36512261580381], [349.0, 19.86363636363636], [350.0, 17.428571428571427], [351.0, 11.5], [340.0, 43.22222222222222], [341.0, 48.42857142857143], [342.0, 46.21830985915493], [343.0, 43.81954887218046], [345.0, 46.64705882352942], [346.0, 42.90625], [347.0, 64.02777777777779], [354.0, 23.77181208053691], [355.0, 22.578947368421055], [364.0, 13.909090909090912], [365.0, 22.09090909090909], [366.0, 20.0], [367.0, 15.955414012738851], [356.0, 28.125], [357.0, 29.612244897959183], [358.0, 23.257485029940117], [359.0, 17.0], [360.0, 25.82300884955751], [361.0, 19.5], [362.0, 14.636363636363637], [363.0, 13.139534883720929], [380.0, 3.0], [369.0, 3.0], [368.0, 3.9999999999999996], [370.0, 5.1818181818181825], [375.0, 24.46969696969696], [376.0, 21.061224489795922], [377.0, 19.260416666666675], [378.0, 10.073170731707316], [379.0, 2.3333333333333335], [383.0, 19.24324324324325], [382.0, 60.63636363636363], [381.0, 113.75], [384.0, 24.37085622757045]], "isOverall": false, "label": "write", "isController": false}, {"data": [[323.5415967699073, 25.32650369633379]], "isOverall": false, "label": "write-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 384.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 596206.0, "minX": 1.794897515E12, "maxY": 2457063.0, "series": [{"data": [[1.794897539E12, 2360167.0], [1.79489754E12, 617321.0], [1.794897538E12, 2317602.0], [1.794897537E12, 2319426.0], [1.794897519E12, 1777965.0], [1.79489752E12, 1819442.0], [1.794897518E12, 1715490.0], [1.794897517E12, 1625889.0], [1.794897515E12, 1003463.0], [1.794897516E12, 1576588.0], [1.794897525E12, 2218226.0], [1.794897523E12, 2000046.0], [1.794897524E12, 2006975.0], [1.794897522E12, 1971474.0], [1.794897521E12, 1887074.0], [1.79489753E12, 2150015.0], [1.794897529E12, 2283193.0], [1.794897527E12, 2290378.0], [1.794897528E12, 2371925.0], [1.794897526E12, 2307889.0], [1.794897535E12, 2457063.0], [1.794897536E12, 2324685.0], [1.794897534E12, 2242305.0], [1.794897533E12, 2339843.0], [1.794897531E12, 2359094.0], [1.794897532E12, 2335048.0]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.794897539E12, 2279851.0], [1.79489754E12, 596206.0], [1.794897538E12, 2238245.0], [1.794897537E12, 2241248.0], [1.794897519E12, 1717710.0], [1.79489752E12, 1757229.0], [1.794897518E12, 1657638.0], [1.794897517E12, 1570420.0], [1.794897515E12, 969021.0], [1.794897516E12, 1522704.0], [1.794897525E12, 2143244.0], [1.794897523E12, 1931704.0], [1.794897524E12, 1938344.0], [1.794897522E12, 1903916.0], [1.794897521E12, 1822646.0], [1.79489753E12, 2076412.0], [1.794897529E12, 2205339.0], [1.794897527E12, 2212388.0], [1.794897528E12, 2290707.0], [1.794897526E12, 2229319.0], [1.794897535E12, 2374313.0], [1.794897536E12, 2246550.0], [1.794897534E12, 2165887.0], [1.794897533E12, 2260682.0], [1.794897531E12, 2278346.0], [1.794897532E12, 2255380.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.79489754E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 13.482669425763055, "minX": 1.794897515E12, "maxY": 60.024099801531065, "series": [{"data": [[1.794897539E12, 13.482669425763055], [1.79489754E12, 43.306627101879315], [1.794897538E12, 18.415943172849282], [1.794897537E12, 15.299973732597833], [1.794897519E12, 27.539910928400204], [1.79489752E12, 31.02377762893501], [1.794897518E12, 24.048633297834584], [1.794897517E12, 26.713375796178394], [1.794897515E12, 24.185792349726782], [1.794897516E12, 21.83384853168474], [1.794897525E12, 31.581433672068083], [1.794897523E12, 21.149299207800077], [1.794897524E12, 33.103249316732466], [1.794897522E12, 24.151468315301397], [1.794897521E12, 22.511785598966682], [1.79489753E12, 60.024099801531065], [1.794897529E12, 22.94527495995735], [1.794897527E12, 26.84566258648214], [1.794897528E12, 25.59342071446933], [1.794897526E12, 30.320042249802032], [1.794897535E12, 17.996528638730457], [1.794897536E12, 16.011530398322925], [1.794897534E12, 23.76923076923077], [1.794897533E12, 25.356770833333357], [1.794897531E12, 29.364341085271278], [1.794897532E12, 18.334638475593792]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.79489754E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 13.458096223486805, "minX": 1.794897515E12, "maxY": 59.96172384462716, "series": [{"data": [[1.794897539E12, 13.458096223486805], [1.79489754E12, 43.26211671612268], [1.794897538E12, 18.4030518284662], [1.794897537E12, 15.281061203047024], [1.794897519E12, 27.418293936279515], [1.79489752E12, 30.93871399866044], [1.794897518E12, 23.98296059637911], [1.794897517E12, 25.92431622330462], [1.794897515E12, 24.10139647844569], [1.794897516E12, 21.744590417310636], [1.794897525E12, 31.485306234550915], [1.794897523E12, 21.04082876294939], [1.794897524E12, 33.01488004858795], [1.794897522E12, 24.094590417310627], [1.794897521E12, 22.475944462382916], [1.79489753E12, 59.96172384462716], [1.794897529E12, 22.90576615056067], [1.794897527E12, 26.81798829164454], [1.794897528E12, 25.553328193266566], [1.794897526E12, 30.254026934248664], [1.794897535E12, 17.975452516736954], [1.794897536E12, 15.977987421383611], [1.794897534E12, 23.724381625441747], [1.794897533E12, 25.324739583333336], [1.794897531E12, 29.3100775193798], [1.794897532E12, 18.30618637431483]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.79489754E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.0019782393669634042, "minX": 1.794897515E12, "maxY": 0.7810894141829408, "series": [{"data": [[1.794897539E12, 0.011381272633212659], [1.79489754E12, 0.0019782393669634042], [1.794897538E12, 0.009734280452512527], [1.794897537E12, 0.04018912529550829], [1.794897519E12, 0.7810894141829408], [1.79489752E12, 0.250167448091092], [1.794897518E12, 0.7167199148029814], [1.794897517E12, 0.38216560509554104], [1.794897515E12, 0.20947176684881594], [1.794897516E12, 0.09389489953632167], [1.794897525E12, 0.24471299093655569], [1.794897523E12, 0.33363802559415023], [1.794897524E12, 0.23929547525053171], [1.794897522E12, 0.11777434312210197], [1.794897521E12, 0.3832741362608974], [1.79489753E12, 0.03288914091295718], [1.794897529E12, 0.047250400427122245], [1.794897527E12, 0.04763171899946781], [1.794897528E12, 0.02338730403495246], [1.794897526E12, 0.24504885133351004], [1.794897535E12, 0.022067939499132168], [1.794897536E12, 0.02148846960167714], [1.794897534E12, 0.026094047295460752], [1.794897533E12, 0.056770833333333465], [1.794897531E12, 0.014987080103359147], [1.794897532E12, 0.02793004437483684]], "isOverall": false, "label": "write", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.79489754E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 1.0, "minX": 1.794897515E12, "maxY": 516.0, "series": [{"data": [[1.794897539E12, 126.0], [1.79489754E12, 193.0], [1.794897538E12, 123.0], [1.794897537E12, 105.0], [1.794897519E12, 516.0], [1.79489752E12, 235.0], [1.794897518E12, 306.0], [1.794897517E12, 226.0], [1.794897515E12, 110.0], [1.794897516E12, 379.0], [1.794897525E12, 138.0], [1.794897523E12, 236.0], [1.794897524E12, 217.0], [1.794897522E12, 206.0], [1.794897521E12, 282.0], [1.79489753E12, 338.0], [1.794897529E12, 146.0], [1.794897527E12, 210.0], [1.794897528E12, 203.0], [1.794897526E12, 270.0], [1.794897535E12, 201.0], [1.794897536E12, 86.0], [1.794897534E12, 174.0], [1.794897533E12, 140.0], [1.794897531E12, 180.0], [1.794897532E12, 108.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.794897539E12, 1.0], [1.79489754E12, 3.0], [1.794897538E12, 1.0], [1.794897537E12, 1.0], [1.794897519E12, 2.0], [1.79489752E12, 2.0], [1.794897518E12, 1.0], [1.794897517E12, 2.0], [1.794897515E12, 2.0], [1.794897516E12, 2.0], [1.794897525E12, 2.0], [1.794897523E12, 2.0], [1.794897524E12, 1.0], [1.794897522E12, 2.0], [1.794897521E12, 1.0], [1.79489753E12, 2.0], [1.794897529E12, 1.0], [1.794897527E12, 2.0], [1.794897528E12, 1.0], [1.794897526E12, 2.0], [1.794897535E12, 1.0], [1.794897536E12, 1.0], [1.794897534E12, 2.0], [1.794897533E12, 2.0], [1.794897531E12, 2.0], [1.794897532E12, 1.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.794897539E12, 27.0], [1.79489754E12, 97.0], [1.794897538E12, 37.0], [1.794897537E12, 32.0], [1.794897519E12, 56.0], [1.79489752E12, 62.0], [1.794897518E12, 57.0], [1.794897517E12, 59.0], [1.794897515E12, 63.0], [1.794897516E12, 48.0], [1.794897525E12, 60.0], [1.794897523E12, 49.0], [1.794897524E12, 67.0], [1.794897522E12, 52.0], [1.794897521E12, 52.0], [1.79489753E12, 126.0], [1.794897529E12, 44.0], [1.794897527E12, 58.0], [1.794897528E12, 50.0], [1.794897526E12, 59.0], [1.794897535E12, 37.0], [1.794897536E12, 32.0], [1.794897534E12, 47.0], [1.794897533E12, 46.0], [1.794897531E12, 57.0], [1.794897532E12, 33.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.794897539E12, 62.0], [1.79489754E12, 153.0], [1.794897538E12, 69.98000000000002], [1.794897537E12, 58.92000000000007], [1.794897519E12, 93.0], [1.79489752E12, 104.13000000000011], [1.794897518E12, 101.0], [1.794897517E12, 128.0], [1.794897515E12, 95.0], [1.794897516E12, 176.29000000000497], [1.794897525E12, 103.57999999999993], [1.794897523E12, 101.34000000000015], [1.794897524E12, 123.0], [1.794897522E12, 100.0], [1.794897521E12, 86.0], [1.79489753E12, 259.0], [1.794897529E12, 87.0], [1.794897527E12, 144.8199999999997], [1.794897528E12, 99.0], [1.794897526E12, 93.11999999999989], [1.794897535E12, 107.65999999999985], [1.794897536E12, 54.0], [1.794897534E12, 96.0], [1.794897533E12, 81.0], [1.794897531E12, 124.0], [1.794897532E12, 58.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.794897539E12, 10.0], [1.79489754E12, 33.0], [1.794897538E12, 15.0], [1.794897537E12, 11.0], [1.794897519E12, 22.0], [1.79489752E12, 26.0], [1.794897518E12, 16.0], [1.794897517E12, 19.0], [1.794897515E12, 15.0], [1.794897516E12, 13.0], [1.794897525E12, 27.0], [1.794897523E12, 14.0], [1.794897524E12, 28.0], [1.794897522E12, 18.0], [1.794897521E12, 16.0], [1.79489753E12, 45.0], [1.794897529E12, 18.5], [1.794897527E12, 19.5], [1.794897528E12, 20.0], [1.794897526E12, 25.0], [1.794897535E12, 11.0], [1.794897536E12, 13.0], [1.794897534E12, 18.0], [1.794897533E12, 22.0], [1.794897531E12, 24.0], [1.794897532E12, 16.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.794897539E12, 37.0], [1.79489754E12, 119.39999999999998], [1.794897538E12, 45.0], [1.794897537E12, 42.0], [1.794897519E12, 69.0], [1.79489752E12, 73.0], [1.794897518E12, 69.0], [1.794897517E12, 71.0], [1.794897515E12, 77.0], [1.794897516E12, 60.0], [1.794897525E12, 75.0], [1.794897523E12, 65.0], [1.794897524E12, 81.0], [1.794897522E12, 63.0], [1.794897521E12, 64.0], [1.79489753E12, 154.5999999999999], [1.794897529E12, 56.0], [1.794897527E12, 80.0], [1.794897528E12, 70.0], [1.794897526E12, 70.0], [1.794897535E12, 59.0], [1.794897536E12, 39.0], [1.794897534E12, 63.0], [1.794897533E12, 58.0], [1.794897531E12, 74.0], [1.794897532E12, 41.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.79489754E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 10.0, "minX": 1011.0, "maxY": 45.0, "series": [{"data": [[1011.0, 33.0], [1647.0, 15.0], [2588.0, 13.0], [2669.0, 19.0], [2817.0, 16.0], [2919.0, 22.0], [2986.0, 26.0], [3097.0, 16.0], [3235.0, 18.0], [3282.0, 14.0], [3293.0, 28.0], [3527.0, 45.0], [3641.0, 27.0], [3679.0, 18.0], [3787.0, 25.0], [3758.0, 19.5], [3746.0, 18.5], [3831.0, 16.0], [3816.0, 13.0], [3807.0, 11.0], [3801.0, 15.0], [3891.0, 20.0], [3870.0, 24.0], [3840.0, 22.0], [3866.0, 10.0], [4033.0, 11.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 4033.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 10.0, "minX": 1011.0, "maxY": 45.0, "series": [{"data": [[1011.0, 33.0], [1647.0, 15.0], [2588.0, 13.0], [2669.0, 19.0], [2817.0, 16.0], [2919.0, 22.0], [2986.0, 26.0], [3097.0, 16.0], [3235.0, 18.0], [3282.0, 14.0], [3293.0, 28.0], [3527.0, 45.0], [3641.0, 27.0], [3679.0, 18.0], [3787.0, 24.0], [3758.0, 19.0], [3746.0, 18.0], [3831.0, 16.0], [3816.0, 13.0], [3807.0, 11.0], [3801.0, 15.0], [3891.0, 20.0], [3870.0, 24.0], [3840.0, 22.0], [3866.0, 10.0], [4033.0, 11.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 4033.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 929.0, "minX": 1.794897515E12, "maxY": 3842.0, "series": [{"data": [[1.794897539E12, 3837.0], [1.79489754E12, 929.0], [1.794897538E12, 3842.0], [1.794897537E12, 3839.0], [1.794897519E12, 2965.0], [1.79489752E12, 2938.0], [1.794897518E12, 2751.0], [1.794897517E12, 2754.0], [1.794897515E12, 1667.0], [1.794897516E12, 2605.0], [1.794897525E12, 3625.0], [1.794897523E12, 3291.0], [1.794897524E12, 3326.0], [1.794897522E12, 3235.0], [1.794897521E12, 3122.0], [1.79489753E12, 3559.0], [1.794897529E12, 3839.0], [1.794897527E12, 3795.0], [1.794897528E12, 3729.0], [1.794897526E12, 3810.0], [1.794897535E12, 3842.0], [1.794897536E12, 3840.0], [1.794897534E12, 3811.0], [1.794897533E12, 3839.0], [1.794897531E12, 3807.0], [1.794897532E12, 3840.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.79489754E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 1011.0, "minX": 1.794897515E12, "maxY": 4033.0, "series": [{"data": [[1.794897539E12, 3866.0], [1.79489754E12, 1011.0], [1.794897538E12, 3801.0], [1.794897537E12, 3807.0], [1.794897519E12, 2919.0], [1.79489752E12, 2986.0], [1.794897518E12, 2817.0], [1.794897517E12, 2669.0], [1.794897515E12, 1647.0], [1.794897516E12, 2588.0], [1.794897525E12, 3641.0], [1.794897523E12, 3282.0], [1.794897524E12, 3293.0], [1.794897522E12, 3235.0], [1.794897521E12, 3097.0], [1.79489753E12, 3527.0], [1.794897529E12, 3746.0], [1.794897527E12, 3758.0], [1.794897528E12, 3891.0], [1.794897526E12, 3787.0], [1.794897535E12, 4033.0], [1.794897536E12, 3816.0], [1.794897534E12, 3679.0], [1.794897533E12, 3840.0], [1.794897531E12, 3870.0], [1.794897532E12, 3831.0]], "isOverall": false, "label": "201", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.79489754E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 1011.0, "minX": 1.794897515E12, "maxY": 4033.0, "series": [{"data": [[1.794897539E12, 3866.0], [1.79489754E12, 1011.0], [1.794897538E12, 3801.0], [1.794897537E12, 3807.0], [1.794897519E12, 2919.0], [1.79489752E12, 2986.0], [1.794897518E12, 2817.0], [1.794897517E12, 2669.0], [1.794897515E12, 1647.0], [1.794897516E12, 2588.0], [1.794897525E12, 3641.0], [1.794897523E12, 3282.0], [1.794897524E12, 3293.0], [1.794897522E12, 3235.0], [1.794897521E12, 3097.0], [1.79489753E12, 3527.0], [1.794897529E12, 3746.0], [1.794897527E12, 3758.0], [1.794897528E12, 3891.0], [1.794897526E12, 3787.0], [1.794897535E12, 4033.0], [1.794897536E12, 3816.0], [1.794897534E12, 3679.0], [1.794897533E12, 3840.0], [1.794897531E12, 3870.0], [1.794897532E12, 3831.0]], "isOverall": false, "label": "write-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.79489754E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 1011.0, "minX": 1.794897515E12, "maxY": 4033.0, "series": [{"data": [[1.794897539E12, 3866.0], [1.79489754E12, 1011.0], [1.794897538E12, 3801.0], [1.794897537E12, 3807.0], [1.794897519E12, 2919.0], [1.79489752E12, 2986.0], [1.794897518E12, 2817.0], [1.794897517E12, 2669.0], [1.794897515E12, 1647.0], [1.794897516E12, 2588.0], [1.794897525E12, 3641.0], [1.794897523E12, 3282.0], [1.794897524E12, 3293.0], [1.794897522E12, 3235.0], [1.794897521E12, 3097.0], [1.79489753E12, 3527.0], [1.794897529E12, 3746.0], [1.794897527E12, 3758.0], [1.794897528E12, 3891.0], [1.794897526E12, 3787.0], [1.794897535E12, 4033.0], [1.794897536E12, 3816.0], [1.794897534E12, 3679.0], [1.794897533E12, 3840.0], [1.794897531E12, 3870.0], [1.794897532E12, 3831.0]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.79489754E12, "title": "Total Transactions Per Second"}},
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

