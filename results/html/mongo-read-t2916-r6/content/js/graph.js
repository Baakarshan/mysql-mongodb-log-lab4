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
        data: {"result": {"minY": 1999.0, "minX": 0.0, "maxY": 6116.0, "series": [{"data": [[0.0, 1999.0], [0.1, 2000.0], [0.2, 2000.0], [0.3, 2000.0], [0.4, 2000.0], [0.5, 2000.0], [0.6, 2000.0], [0.7, 2000.0], [0.8, 2000.0], [0.9, 2000.0], [1.0, 2000.0], [1.1, 2000.0], [1.2, 2000.0], [1.3, 2000.0], [1.4, 2000.0], [1.5, 2000.0], [1.6, 2000.0], [1.7, 2000.0], [1.8, 2000.0], [1.9, 2000.0], [2.0, 2000.0], [2.1, 2000.0], [2.2, 2000.0], [2.3, 2000.0], [2.4, 2000.0], [2.5, 2000.0], [2.6, 2000.0], [2.7, 2000.0], [2.8, 2000.0], [2.9, 2000.0], [3.0, 2000.0], [3.1, 2000.0], [3.2, 2000.0], [3.3, 2000.0], [3.4, 2000.0], [3.5, 2000.0], [3.6, 2000.0], [3.7, 2000.0], [3.8, 2000.0], [3.9, 2000.0], [4.0, 2000.0], [4.1, 2000.0], [4.2, 2000.0], [4.3, 2000.0], [4.4, 2000.0], [4.5, 2000.0], [4.6, 2000.0], [4.7, 2000.0], [4.8, 2000.0], [4.9, 2000.0], [5.0, 2000.0], [5.1, 2000.0], [5.2, 2000.0], [5.3, 2000.0], [5.4, 2000.0], [5.5, 2000.0], [5.6, 2000.0], [5.7, 2000.0], [5.8, 2000.0], [5.9, 2000.0], [6.0, 2000.0], [6.1, 2000.0], [6.2, 2000.0], [6.3, 2000.0], [6.4, 2000.0], [6.5, 2000.0], [6.6, 2000.0], [6.7, 2000.0], [6.8, 2000.0], [6.9, 2000.0], [7.0, 2000.0], [7.1, 2000.0], [7.2, 2000.0], [7.3, 2000.0], [7.4, 2000.0], [7.5, 2000.0], [7.6, 2000.0], [7.7, 2000.0], [7.8, 2000.0], [7.9, 2000.0], [8.0, 2000.0], [8.1, 2000.0], [8.2, 2000.0], [8.3, 2000.0], [8.4, 2000.0], [8.5, 2000.0], [8.6, 2000.0], [8.7, 2000.0], [8.8, 2000.0], [8.9, 2000.0], [9.0, 2000.0], [9.1, 2000.0], [9.2, 2000.0], [9.3, 2000.0], [9.4, 2000.0], [9.5, 2000.0], [9.6, 2000.0], [9.7, 2000.0], [9.8, 2000.0], [9.9, 2000.0], [10.0, 2000.0], [10.1, 2000.0], [10.2, 2000.0], [10.3, 2000.0], [10.4, 2000.0], [10.5, 2000.0], [10.6, 2000.0], [10.7, 2000.0], [10.8, 2000.0], [10.9, 2000.0], [11.0, 2000.0], [11.1, 2000.0], [11.2, 2000.0], [11.3, 2000.0], [11.4, 2000.0], [11.5, 2000.0], [11.6, 2000.0], [11.7, 2000.0], [11.8, 2000.0], [11.9, 2000.0], [12.0, 2000.0], [12.1, 2000.0], [12.2, 2000.0], [12.3, 2000.0], [12.4, 2000.0], [12.5, 2000.0], [12.6, 2000.0], [12.7, 2000.0], [12.8, 2000.0], [12.9, 2000.0], [13.0, 2000.0], [13.1, 2000.0], [13.2, 2000.0], [13.3, 2000.0], [13.4, 2001.0], [13.5, 2001.0], [13.6, 2001.0], [13.7, 2001.0], [13.8, 2001.0], [13.9, 2001.0], [14.0, 2001.0], [14.1, 2001.0], [14.2, 2001.0], [14.3, 2001.0], [14.4, 2001.0], [14.5, 2001.0], [14.6, 2001.0], [14.7, 2001.0], [14.8, 2001.0], [14.9, 2001.0], [15.0, 2001.0], [15.1, 2001.0], [15.2, 2001.0], [15.3, 2001.0], [15.4, 2001.0], [15.5, 2001.0], [15.6, 2001.0], [15.7, 2001.0], [15.8, 2001.0], [15.9, 2001.0], [16.0, 2001.0], [16.1, 2001.0], [16.2, 2001.0], [16.3, 2001.0], [16.4, 2001.0], [16.5, 2001.0], [16.6, 2001.0], [16.7, 2001.0], [16.8, 2001.0], [16.9, 2001.0], [17.0, 2001.0], [17.1, 2001.0], [17.2, 2001.0], [17.3, 2001.0], [17.4, 2001.0], [17.5, 2001.0], [17.6, 2001.0], [17.7, 2001.0], [17.8, 2001.0], [17.9, 2001.0], [18.0, 2001.0], [18.1, 2001.0], [18.2, 2001.0], [18.3, 2001.0], [18.4, 2001.0], [18.5, 2001.0], [18.6, 2001.0], [18.7, 2001.0], [18.8, 2001.0], [18.9, 2001.0], [19.0, 2001.0], [19.1, 2001.0], [19.2, 2001.0], [19.3, 2001.0], [19.4, 2001.0], [19.5, 2001.0], [19.6, 2001.0], [19.7, 2001.0], [19.8, 2001.0], [19.9, 2001.0], [20.0, 2001.0], [20.1, 2001.0], [20.2, 2001.0], [20.3, 2001.0], [20.4, 2001.0], [20.5, 2001.0], [20.6, 2001.0], [20.7, 2001.0], [20.8, 2001.0], [20.9, 2001.0], [21.0, 2001.0], [21.1, 2001.0], [21.2, 2001.0], [21.3, 2001.0], [21.4, 2001.0], [21.5, 2001.0], [21.6, 2001.0], [21.7, 2001.0], [21.8, 2001.0], [21.9, 2001.0], [22.0, 2001.0], [22.1, 2001.0], [22.2, 2001.0], [22.3, 2001.0], [22.4, 2001.0], [22.5, 2001.0], [22.6, 2001.0], [22.7, 2001.0], [22.8, 2001.0], [22.9, 2001.0], [23.0, 2001.0], [23.1, 2001.0], [23.2, 2001.0], [23.3, 2001.0], [23.4, 2001.0], [23.5, 2001.0], [23.6, 2001.0], [23.7, 2001.0], [23.8, 2001.0], [23.9, 2001.0], [24.0, 2001.0], [24.1, 2001.0], [24.2, 2001.0], [24.3, 2001.0], [24.4, 2001.0], [24.5, 2001.0], [24.6, 2001.0], [24.7, 2001.0], [24.8, 2001.0], [24.9, 2001.0], [25.0, 2001.0], [25.1, 2001.0], [25.2, 2001.0], [25.3, 2001.0], [25.4, 2001.0], [25.5, 2001.0], [25.6, 2001.0], [25.7, 2001.0], [25.8, 2001.0], [25.9, 2001.0], [26.0, 2001.0], [26.1, 2001.0], [26.2, 2001.0], [26.3, 2001.0], [26.4, 2001.0], [26.5, 2001.0], [26.6, 2001.0], [26.7, 2001.0], [26.8, 2001.0], [26.9, 2001.0], [27.0, 2001.0], [27.1, 2001.0], [27.2, 2001.0], [27.3, 2001.0], [27.4, 2001.0], [27.5, 2001.0], [27.6, 2001.0], [27.7, 2001.0], [27.8, 2001.0], [27.9, 2001.0], [28.0, 2001.0], [28.1, 2001.0], [28.2, 2001.0], [28.3, 2001.0], [28.4, 2001.0], [28.5, 2001.0], [28.6, 2001.0], [28.7, 2001.0], [28.8, 2001.0], [28.9, 2001.0], [29.0, 2001.0], [29.1, 2001.0], [29.2, 2001.0], [29.3, 2001.0], [29.4, 2001.0], [29.5, 2001.0], [29.6, 2001.0], [29.7, 2001.0], [29.8, 2001.0], [29.9, 2001.0], [30.0, 2001.0], [30.1, 2001.0], [30.2, 2001.0], [30.3, 2001.0], [30.4, 2001.0], [30.5, 2001.0], [30.6, 2001.0], [30.7, 2001.0], [30.8, 2001.0], [30.9, 2001.0], [31.0, 2001.0], [31.1, 2001.0], [31.2, 2001.0], [31.3, 2001.0], [31.4, 2001.0], [31.5, 2001.0], [31.6, 2001.0], [31.7, 2001.0], [31.8, 2001.0], [31.9, 2001.0], [32.0, 2001.0], [32.1, 2001.0], [32.2, 2001.0], [32.3, 2001.0], [32.4, 2001.0], [32.5, 2001.0], [32.6, 2001.0], [32.7, 2001.0], [32.8, 2001.0], [32.9, 2001.0], [33.0, 2001.0], [33.1, 2001.0], [33.2, 2001.0], [33.3, 2001.0], [33.4, 2001.0], [33.5, 2001.0], [33.6, 2001.0], [33.7, 2001.0], [33.8, 2001.0], [33.9, 2001.0], [34.0, 2001.0], [34.1, 2001.0], [34.2, 2001.0], [34.3, 2001.0], [34.4, 2001.0], [34.5, 2001.0], [34.6, 2001.0], [34.7, 2001.0], [34.8, 2001.0], [34.9, 2001.0], [35.0, 2001.0], [35.1, 2001.0], [35.2, 2001.0], [35.3, 2001.0], [35.4, 2001.0], [35.5, 2001.0], [35.6, 2001.0], [35.7, 2001.0], [35.8, 2001.0], [35.9, 2001.0], [36.0, 2001.0], [36.1, 2001.0], [36.2, 2001.0], [36.3, 2001.0], [36.4, 2001.0], [36.5, 2001.0], [36.6, 2001.0], [36.7, 2001.0], [36.8, 2001.0], [36.9, 2001.0], [37.0, 2001.0], [37.1, 2001.0], [37.2, 2001.0], [37.3, 2001.0], [37.4, 2001.0], [37.5, 2001.0], [37.6, 2001.0], [37.7, 2001.0], [37.8, 2001.0], [37.9, 2001.0], [38.0, 2001.0], [38.1, 2001.0], [38.2, 2001.0], [38.3, 2001.0], [38.4, 2001.0], [38.5, 2001.0], [38.6, 2001.0], [38.7, 2001.0], [38.8, 2001.0], [38.9, 2001.0], [39.0, 2001.0], [39.1, 2001.0], [39.2, 2001.0], [39.3, 2001.0], [39.4, 2001.0], [39.5, 2001.0], [39.6, 2001.0], [39.7, 2001.0], [39.8, 2001.0], [39.9, 2001.0], [40.0, 2001.0], [40.1, 2001.0], [40.2, 2001.0], [40.3, 2001.0], [40.4, 2001.0], [40.5, 2001.0], [40.6, 2001.0], [40.7, 2001.0], [40.8, 2001.0], [40.9, 2001.0], [41.0, 2001.0], [41.1, 2001.0], [41.2, 2001.0], [41.3, 2001.0], [41.4, 2001.0], [41.5, 2001.0], [41.6, 2001.0], [41.7, 2001.0], [41.8, 2001.0], [41.9, 2001.0], [42.0, 2001.0], [42.1, 2001.0], [42.2, 2001.0], [42.3, 2001.0], [42.4, 2001.0], [42.5, 2001.0], [42.6, 2001.0], [42.7, 2001.0], [42.8, 2001.0], [42.9, 2001.0], [43.0, 2001.0], [43.1, 2001.0], [43.2, 2001.0], [43.3, 2001.0], [43.4, 2001.0], [43.5, 2001.0], [43.6, 2001.0], [43.7, 2001.0], [43.8, 2001.0], [43.9, 2001.0], [44.0, 2001.0], [44.1, 2001.0], [44.2, 2001.0], [44.3, 2001.0], [44.4, 2001.0], [44.5, 2001.0], [44.6, 2001.0], [44.7, 2001.0], [44.8, 2001.0], [44.9, 2001.0], [45.0, 2001.0], [45.1, 2001.0], [45.2, 2001.0], [45.3, 2001.0], [45.4, 2001.0], [45.5, 2001.0], [45.6, 2001.0], [45.7, 2001.0], [45.8, 2001.0], [45.9, 2001.0], [46.0, 2001.0], [46.1, 2001.0], [46.2, 2001.0], [46.3, 2001.0], [46.4, 2001.0], [46.5, 2001.0], [46.6, 2001.0], [46.7, 2001.0], [46.8, 2001.0], [46.9, 2001.0], [47.0, 2001.0], [47.1, 2001.0], [47.2, 2001.0], [47.3, 2001.0], [47.4, 2001.0], [47.5, 2001.0], [47.6, 2001.0], [47.7, 2001.0], [47.8, 2001.0], [47.9, 2001.0], [48.0, 2001.0], [48.1, 2001.0], [48.2, 2001.0], [48.3, 2001.0], [48.4, 2001.0], [48.5, 2001.0], [48.6, 2001.0], [48.7, 2001.0], [48.8, 2001.0], [48.9, 2001.0], [49.0, 2001.0], [49.1, 2001.0], [49.2, 2001.0], [49.3, 2001.0], [49.4, 2001.0], [49.5, 2001.0], [49.6, 2001.0], [49.7, 2001.0], [49.8, 2001.0], [49.9, 2001.0], [50.0, 2001.0], [50.1, 2001.0], [50.2, 2001.0], [50.3, 2001.0], [50.4, 2001.0], [50.5, 2001.0], [50.6, 2001.0], [50.7, 2001.0], [50.8, 2001.0], [50.9, 2001.0], [51.0, 2001.0], [51.1, 2001.0], [51.2, 2001.0], [51.3, 2001.0], [51.4, 2001.0], [51.5, 2001.0], [51.6, 2001.0], [51.7, 2001.0], [51.8, 2001.0], [51.9, 2001.0], [52.0, 2001.0], [52.1, 2001.0], [52.2, 2001.0], [52.3, 2001.0], [52.4, 2001.0], [52.5, 2001.0], [52.6, 2001.0], [52.7, 2001.0], [52.8, 2001.0], [52.9, 2001.0], [53.0, 2001.0], [53.1, 2001.0], [53.2, 2001.0], [53.3, 2001.0], [53.4, 2001.0], [53.5, 2001.0], [53.6, 2001.0], [53.7, 2001.0], [53.8, 2001.0], [53.9, 2001.0], [54.0, 2001.0], [54.1, 2001.0], [54.2, 2001.0], [54.3, 2001.0], [54.4, 2001.0], [54.5, 2001.0], [54.6, 2001.0], [54.7, 2001.0], [54.8, 2001.0], [54.9, 2001.0], [55.0, 2002.0], [55.1, 2002.0], [55.2, 2002.0], [55.3, 2002.0], [55.4, 2002.0], [55.5, 2002.0], [55.6, 2002.0], [55.7, 2002.0], [55.8, 2002.0], [55.9, 2002.0], [56.0, 2002.0], [56.1, 2002.0], [56.2, 2002.0], [56.3, 2002.0], [56.4, 2002.0], [56.5, 2002.0], [56.6, 2002.0], [56.7, 2002.0], [56.8, 2002.0], [56.9, 2002.0], [57.0, 2002.0], [57.1, 2002.0], [57.2, 2002.0], [57.3, 2002.0], [57.4, 2002.0], [57.5, 2002.0], [57.6, 2002.0], [57.7, 2002.0], [57.8, 2002.0], [57.9, 2002.0], [58.0, 2002.0], [58.1, 2002.0], [58.2, 2002.0], [58.3, 2002.0], [58.4, 2002.0], [58.5, 2002.0], [58.6, 2002.0], [58.7, 2002.0], [58.8, 2002.0], [58.9, 2002.0], [59.0, 2002.0], [59.1, 2002.0], [59.2, 2002.0], [59.3, 2002.0], [59.4, 2002.0], [59.5, 2002.0], [59.6, 2002.0], [59.7, 2002.0], [59.8, 2002.0], [59.9, 2002.0], [60.0, 2002.0], [60.1, 2002.0], [60.2, 2002.0], [60.3, 2002.0], [60.4, 2002.0], [60.5, 2002.0], [60.6, 2002.0], [60.7, 2002.0], [60.8, 2002.0], [60.9, 2002.0], [61.0, 2002.0], [61.1, 2002.0], [61.2, 2002.0], [61.3, 2002.0], [61.4, 2002.0], [61.5, 2002.0], [61.6, 2002.0], [61.7, 2002.0], [61.8, 2002.0], [61.9, 2002.0], [62.0, 2002.0], [62.1, 2002.0], [62.2, 2002.0], [62.3, 2002.0], [62.4, 2002.0], [62.5, 2002.0], [62.6, 2002.0], [62.7, 2002.0], [62.8, 2002.0], [62.9, 2002.0], [63.0, 2002.0], [63.1, 2002.0], [63.2, 2002.0], [63.3, 2002.0], [63.4, 2002.0], [63.5, 2002.0], [63.6, 2002.0], [63.7, 2002.0], [63.8, 2002.0], [63.9, 2002.0], [64.0, 2002.0], [64.1, 2002.0], [64.2, 2002.0], [64.3, 2002.0], [64.4, 2002.0], [64.5, 2002.0], [64.6, 2002.0], [64.7, 2002.0], [64.8, 2002.0], [64.9, 2002.0], [65.0, 2002.0], [65.1, 2002.0], [65.2, 2002.0], [65.3, 2002.0], [65.4, 2002.0], [65.5, 2003.0], [65.6, 2003.0], [65.7, 2003.0], [65.8, 2003.0], [65.9, 2003.0], [66.0, 2003.0], [66.1, 2003.0], [66.2, 2003.0], [66.3, 2003.0], [66.4, 2003.0], [66.5, 2003.0], [66.6, 2003.0], [66.7, 2003.0], [66.8, 2003.0], [66.9, 2003.0], [67.0, 2003.0], [67.1, 2003.0], [67.2, 2003.0], [67.3, 2003.0], [67.4, 2003.0], [67.5, 2003.0], [67.6, 2003.0], [67.7, 2003.0], [67.8, 2003.0], [67.9, 2003.0], [68.0, 2003.0], [68.1, 2004.0], [68.2, 2004.0], [68.3, 2004.0], [68.4, 2004.0], [68.5, 2004.0], [68.6, 2004.0], [68.7, 2004.0], [68.8, 2004.0], [68.9, 2004.0], [69.0, 2004.0], [69.1, 2004.0], [69.2, 2004.0], [69.3, 2004.0], [69.4, 2004.0], [69.5, 2005.0], [69.6, 2005.0], [69.7, 2005.0], [69.8, 2005.0], [69.9, 2005.0], [70.0, 2005.0], [70.1, 2005.0], [70.2, 2005.0], [70.3, 2005.0], [70.4, 2006.0], [70.5, 2006.0], [70.6, 2006.0], [70.7, 2006.0], [70.8, 2006.0], [70.9, 2006.0], [71.0, 2006.0], [71.1, 2007.0], [71.2, 2007.0], [71.3, 2007.0], [71.4, 2007.0], [71.5, 2007.0], [71.6, 2007.0], [71.7, 2008.0], [71.8, 2008.0], [71.9, 2008.0], [72.0, 2008.0], [72.1, 2008.0], [72.2, 2009.0], [72.3, 2009.0], [72.4, 2009.0], [72.5, 2009.0], [72.6, 2009.0], [72.7, 2009.0], [72.8, 2010.0], [72.9, 2010.0], [73.0, 2010.0], [73.1, 2010.0], [73.2, 2010.0], [73.3, 2010.0], [73.4, 2011.0], [73.5, 2011.0], [73.6, 2011.0], [73.7, 2011.0], [73.8, 2011.0], [73.9, 2012.0], [74.0, 2012.0], [74.1, 2012.0], [74.2, 2012.0], [74.3, 2012.0], [74.4, 2013.0], [74.5, 2013.0], [74.6, 2013.0], [74.7, 2013.0], [74.8, 2013.0], [74.9, 2013.0], [75.0, 2014.0], [75.1, 2014.0], [75.2, 2014.0], [75.3, 2014.0], [75.4, 2014.0], [75.5, 2014.0], [75.6, 2014.0], [75.7, 2015.0], [75.8, 2015.0], [75.9, 2015.0], [76.0, 2015.0], [76.1, 2015.0], [76.2, 2015.0], [76.3, 2015.0], [76.4, 2015.0], [76.5, 2015.0], [76.6, 2016.0], [76.7, 2016.0], [76.8, 2016.0], [76.9, 2016.0], [77.0, 2016.0], [77.1, 2016.0], [77.2, 2016.0], [77.3, 2016.0], [77.4, 2016.0], [77.5, 2016.0], [77.6, 2017.0], [77.7, 2017.0], [77.8, 2017.0], [77.9, 2017.0], [78.0, 2017.0], [78.1, 2017.0], [78.2, 2017.0], [78.3, 2017.0], [78.4, 2017.0], [78.5, 2017.0], [78.6, 2017.0], [78.7, 2018.0], [78.8, 2018.0], [78.9, 2018.0], [79.0, 2018.0], [79.1, 2018.0], [79.2, 2018.0], [79.3, 2018.0], [79.4, 2018.0], [79.5, 2018.0], [79.6, 2018.0], [79.7, 2018.0], [79.8, 2019.0], [79.9, 2019.0], [80.0, 2019.0], [80.1, 2019.0], [80.2, 2019.0], [80.3, 2019.0], [80.4, 2019.0], [80.5, 2019.0], [80.6, 2019.0], [80.7, 2019.0], [80.8, 2019.0], [80.9, 2019.0], [81.0, 2020.0], [81.1, 2020.0], [81.2, 2020.0], [81.3, 2020.0], [81.4, 2020.0], [81.5, 2020.0], [81.6, 2020.0], [81.7, 2020.0], [81.8, 2020.0], [81.9, 2020.0], [82.0, 2020.0], [82.1, 2021.0], [82.2, 2021.0], [82.3, 2021.0], [82.4, 2021.0], [82.5, 2021.0], [82.6, 2021.0], [82.7, 2021.0], [82.8, 2021.0], [82.9, 2021.0], [83.0, 2021.0], [83.1, 2021.0], [83.2, 2021.0], [83.3, 2021.0], [83.4, 2022.0], [83.5, 2022.0], [83.6, 2022.0], [83.7, 2022.0], [83.8, 2022.0], [83.9, 2022.0], [84.0, 2022.0], [84.1, 2022.0], [84.2, 2022.0], [84.3, 2022.0], [84.4, 2022.0], [84.5, 2022.0], [84.6, 2023.0], [84.7, 2023.0], [84.8, 2023.0], [84.9, 2023.0], [85.0, 2023.0], [85.1, 2023.0], [85.2, 2023.0], [85.3, 2023.0], [85.4, 2023.0], [85.5, 2023.0], [85.6, 2024.0], [85.7, 2024.0], [85.8, 2024.0], [85.9, 2024.0], [86.0, 2024.0], [86.1, 2024.0], [86.2, 2024.0], [86.3, 2024.0], [86.4, 2025.0], [86.5, 2025.0], [86.6, 2025.0], [86.7, 2025.0], [86.8, 2025.0], [86.9, 2025.0], [87.0, 2025.0], [87.1, 2025.0], [87.2, 2025.0], [87.3, 2026.0], [87.4, 2026.0], [87.5, 2026.0], [87.6, 2026.0], [87.7, 2026.0], [87.8, 2026.0], [87.9, 2026.0], [88.0, 2026.0], [88.1, 2027.0], [88.2, 2027.0], [88.3, 2027.0], [88.4, 2027.0], [88.5, 2027.0], [88.6, 2028.0], [88.7, 2028.0], [88.8, 2028.0], [88.9, 2028.0], [89.0, 2029.0], [89.1, 2029.0], [89.2, 2029.0], [89.3, 2029.0], [89.4, 2030.0], [89.5, 2030.0], [89.6, 2030.0], [89.7, 2030.0], [89.8, 2031.0], [89.9, 2031.0], [90.0, 2031.0], [90.1, 2031.0], [90.2, 2032.0], [90.3, 2032.0], [90.4, 2032.0], [90.5, 2033.0], [90.6, 2033.0], [90.7, 2033.0], [90.8, 2033.0], [90.9, 2033.0], [91.0, 2034.0], [91.1, 2034.0], [91.2, 2034.0], [91.3, 2035.0], [91.4, 2035.0], [91.5, 2036.0], [91.6, 2036.0], [91.7, 2037.0], [91.8, 2037.0], [91.9, 2037.0], [92.0, 2038.0], [92.1, 2038.0], [92.2, 2038.0], [92.3, 2039.0], [92.4, 2039.0], [92.5, 2040.0], [92.6, 2040.0], [92.7, 2041.0], [92.8, 2041.0], [92.9, 2042.0], [93.0, 2042.0], [93.1, 2043.0], [93.2, 2044.0], [93.3, 2045.0], [93.4, 2046.0], [93.5, 2047.0], [93.6, 2048.0], [93.7, 2051.0], [93.8, 2054.0], [93.9, 2055.0], [94.0, 2056.0], [94.1, 2058.0], [94.2, 2062.0], [94.3, 2064.0], [94.4, 2065.0], [94.5, 2066.0], [94.6, 2069.0], [94.7, 2070.0], [94.8, 2075.0], [94.9, 2081.0], [95.0, 2089.0], [95.1, 2109.0], [95.2, 5001.0], [95.3, 5002.0], [95.4, 5003.0], [95.5, 5003.0], [95.6, 5004.0], [95.7, 5004.0], [95.8, 5004.0], [95.9, 5005.0], [96.0, 5005.0], [96.1, 5006.0], [96.2, 5007.0], [96.3, 5008.0], [96.4, 5009.0], [96.5, 5011.0], [96.6, 5016.0], [96.7, 5025.0], [96.8, 5029.0], [96.9, 5050.0], [97.0, 5067.0], [97.1, 6005.0], [97.2, 6009.0], [97.3, 6012.0], [97.4, 6014.0], [97.5, 6015.0], [97.6, 6016.0], [97.7, 6017.0], [97.8, 6019.0], [97.9, 6020.0], [98.0, 6022.0], [98.1, 6024.0], [98.2, 6025.0], [98.3, 6027.0], [98.4, 6029.0], [98.5, 6031.0], [98.6, 6032.0], [98.7, 6033.0], [98.8, 6034.0], [98.9, 6036.0], [99.0, 6037.0], [99.1, 6038.0], [99.2, 6040.0], [99.3, 6042.0], [99.4, 6046.0], [99.5, 6050.0], [99.6, 6056.0], [99.7, 6060.0], [99.8, 6068.0], [99.9, 6087.0]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 8.0, "minX": 1900.0, "maxY": 31678.0, "series": [{"data": [[2100.0, 29.0], [5000.0, 651.0], [6000.0, 941.0], [6100.0, 26.0], [1900.0, 8.0], [2000.0, 31678.0]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 6100.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 33333.0, "minX": 3.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 33333.0, "series": [{"data": [], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [[3.0, 33333.0]], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 3.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 1350.5535714285713, "minX": 1.794895762E12, "maxY": 2916.0, "series": [{"data": [[1.794895791E12, 1350.5535714285713], [1.79489579E12, 2082.5], [1.794895788E12, 2686.0], [1.794895787E12, 2869.506056527591], [1.794895763E12, 2916.0], [1.794895764E12, 2916.0], [1.794895765E12, 2916.0], [1.794895762E12, 2916.0], [1.794895769E12, 2916.0], [1.79489577E12, 2916.0], [1.794895766E12, 2916.0], [1.794895767E12, 2916.0], [1.794895768E12, 2916.0], [1.794895776E12, 2916.0], [1.794895775E12, 2916.0], [1.794895774E12, 2916.0], [1.794895771E12, 2916.0], [1.794895772E12, 2916.0], [1.794895773E12, 2916.0], [1.794895781E12, 2916.0], [1.79489578E12, 2916.0], [1.794895779E12, 2916.0], [1.794895778E12, 2916.0], [1.794895777E12, 2916.0], [1.794895786E12, 2911.204188481673], [1.794895785E12, 2916.0], [1.794895784E12, 2916.0], [1.794895783E12, 2916.0], [1.794895782E12, 2916.0]], "isOverall": false, "label": "Log workload", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794895791E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 2000.0, "minX": 1324.0, "maxY": 6042.0, "series": [{"data": [[1338.0, 6035.0], [1343.0, 6036.0], [1326.0, 6032.0], [1324.0, 6039.5], [1340.0, 6020.0], [1339.0, 6036.0], [1337.0, 6037.0], [1336.0, 6040.0], [1335.0, 6038.0], [1334.0, 6038.0], [1333.0, 6037.0], [1332.0, 6042.0], [1330.0, 6038.5], [1328.0, 6032.0], [1349.0, 6034.5], [1370.0, 6022.0], [1375.0, 6006.0], [1344.0, 6027.0], [1348.0, 6035.0], [1346.0, 6023.0], [1351.0, 6026.5], [1352.0, 6017.0], [1354.0, 6016.0], [1353.0, 6039.0], [1356.0, 6009.0], [1355.0, 6017.0], [1359.0, 6033.0], [1357.0, 6017.0], [1374.0, 6013.0], [1372.0, 6010.0], [1368.0, 6014.0], [1366.0, 6025.5], [1364.0, 6015.333333333333], [1363.0, 6033.0], [1362.0, 6014.0], [1361.0, 6015.0], [1360.0, 6015.0], [2083.0, 5004.0], [2082.0, 5009.0], [2686.0, 5006.5], [2913.0, 2007.0304568527922], [2895.0, 2000.9999999999998], [2904.0, 2000.0], [2908.0, 4081.3362068965516], [2916.0, 2159.6602980013663], [2880.0, 2001.7333333333333], [2882.0, 4605.823529411765], [2881.0, 2001.75], [2884.0, 6021.0], [2883.0, 5620.633333333334], [2886.0, 6016.5], [2885.0, 6020.4], [2890.0, 5633.540540540541], [2887.0, 5003.0], [2892.0, 2000.9642857142858], [2891.0, 3202.4], [2894.0, 2001.3529411764707], [2893.0, 2002.7407407407409], [2896.0, 2000.7777777777778], [2898.0, 2001.2335329341327], [2897.0, 2000.698113207548], [2900.0, 2000.7499999999998], [2899.0, 2000.8571428571431], [2903.0, 2001.0], [2902.0, 2000.5], [2905.0, 2000.8], [2915.0, 2000.9191176470588], [2914.0, 2005.1538461538455], [2912.0, 4046.3064516129034], [2847.0, 2004.0], [2846.0, 2001.4], [2845.0, 2002.25], [2844.0, 2001.5], [2843.0, 2001.4782608695652], [2842.0, 2001.0], [2840.0, 2001.5], [2839.0, 2001.1333333333332], [2838.0, 2003.7777777777778], [2837.0, 2000.7499999999998], [2836.0, 2000.8333333333333], [2835.0, 2000.75], [2834.0, 2000.7619047619048], [2833.0, 2001.0], [2832.0, 2001.0], [2831.0, 2001.4166666666667], [2830.0, 2002.4285714285713], [2829.0, 2002.1153846153848], [2828.0, 2000.9166666666667], [2827.0, 2004.1803278688528], [2826.0, 2023.0], [2825.0, 2001.0], [2824.0, 2000.6666666666667], [2823.0, 2006.5833333333333], [2822.0, 2026.0], [2821.0, 2001.0555555555554], [2820.0, 2018.6666666666667], [2819.0, 2008.25], [2818.0, 2014.0], [2879.0, 2001.6666666666667], [2878.0, 2001.2999999999997], [2877.0, 2001.2499999999998], [2876.0, 2001.1666666666667], [2875.0, 2000.9], [2874.0, 2000.4615384615386], [2873.0, 2001.4285714285713], [2872.0, 2000.5714285714287], [2871.0, 2000.6666666666667], [2870.0, 2000.4615384615386], [2869.0, 2000.5], [2868.0, 2000.6764705882351], [2867.0, 2000.4444444444443], [2865.0, 2001.0], [2864.0, 2001.142857142857], [2863.0, 2002.0625000000002], [2862.0, 2003.0833333333333], [2861.0, 2003.5], [2860.0, 2004.2307692307693], [2859.0, 2012.2857142857144], [2858.0, 2007.125], [2857.0, 2001.2857142857144], [2856.0, 2001.5], [2855.0, 2001.8461538461538], [2854.0, 2002.295081967213], [2853.0, 2002.7307692307695], [2852.0, 2002.9], [2851.0, 2002.7272727272727], [2850.0, 2003.125], [2849.0, 2003.6666666666667], [2848.0, 2006.8], [2911.0, 5920.888888888889], [2910.0, 5691.749999999999], [2909.0, 6036.666666666667], [2907.0, 2013.0815709969788], [2906.0, 2000.8125]], "isOverall": false, "label": "read", "isController": false}, {"data": [[2911.041130411314, 2182.739957399578]], "isOverall": false, "label": "read-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 2916.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 0.0, "minX": 1.794895762E12, "maxY": 4242164.0, "series": [{"data": [[1.794895791E12, 149912.0], [1.79489579E12, 5354.0], [1.794895788E12, 5354.0], [1.794895787E12, 3714963.0], [1.794895763E12, 2859084.0], [1.794895764E12, 2747304.0], [1.794895765E12, 3447792.0], [1.794895762E12, 47196.0], [1.794895769E12, 3825360.0], [1.79489577E12, 3403080.0], [1.794895766E12, 2828940.0], [1.794895767E12, 4242164.0], [1.794895768E12, 3066707.0], [1.794895776E12, 3126516.0], [1.794895775E12, 2657880.0], [1.794895774E12, 3027996.0], [1.794895771E12, 3815424.0], [1.794895772E12, 3366399.0], [1.794895773E12, 2802531.0], [1.794895781E12, 3490020.0], [1.79489578E12, 3112452.0], [1.794895779E12, 3492697.0], [1.794895778E12, 3583604.0], [1.794895777E12, 3763431.0], [1.794895786E12, 3346584.0], [1.794895785E12, 3599316.0], [1.794895784E12, 3013360.0], [1.794895783E12, 3603744.0], [1.794895782E12, 2966282.0]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.794895791E12, 0.0], [1.79489579E12, 0.0], [1.794895788E12, 0.0], [1.794895787E12, 0.0], [1.794895763E12, 0.0], [1.794895764E12, 0.0], [1.794895765E12, 0.0], [1.794895762E12, 0.0], [1.794895769E12, 0.0], [1.79489577E12, 0.0], [1.794895766E12, 0.0], [1.794895767E12, 0.0], [1.794895768E12, 0.0], [1.794895776E12, 0.0], [1.794895775E12, 0.0], [1.794895774E12, 0.0], [1.794895771E12, 0.0], [1.794895772E12, 0.0], [1.794895773E12, 0.0], [1.794895781E12, 0.0], [1.79489578E12, 0.0], [1.794895779E12, 0.0], [1.794895778E12, 0.0], [1.794895777E12, 0.0], [1.794895786E12, 0.0], [1.794895785E12, 0.0], [1.794895784E12, 0.0], [1.794895783E12, 0.0], [1.794895782E12, 0.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794895791E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 2000.7894736842104, "minX": 1.794895762E12, "maxY": 6025.660714285714, "series": [{"data": [[1.794895791E12, 6025.660714285714], [1.79489579E12, 5006.5], [1.794895788E12, 5006.5], [1.794895787E12, 2329.800807537014], [1.794895763E12, 2013.9860990443092], [1.794895764E12, 2009.8408679927684], [1.794895765E12, 2007.4791066282414], [1.794895762E12, 2000.7894736842104], [1.794895769E12, 2009.7662337662316], [1.79489577E12, 2006.831386861317], [1.794895766E12, 2070.9498680738825], [1.794895767E12, 2716.6718192627804], [1.794895768E12, 2179.1300813008124], [1.794895776E12, 2169.7950558213724], [1.794895775E12, 2003.1934579439242], [1.794895774E12, 2010.8244462674327], [1.794895771E12, 2009.2721354166654], [1.794895772E12, 2016.058302583026], [1.794895773E12, 2013.6267730496454], [1.794895781E12, 2002.4804270462625], [1.79489578E12, 2007.0055865921765], [1.794895779E12, 2009.5106685632995], [1.794895778E12, 2463.414275717286], [1.794895777E12, 2968.879461279466], [1.794895786E12, 2349.746447270008], [1.794895785E12, 2004.4665286404424], [1.794895784E12, 2137.8876033057854], [1.794895783E12, 2513.500000000001], [1.794895782E12, 2008.9380234505863]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794895791E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 0.0, "minX": 1.794895762E12, "maxY": 4.9E-324, "series": [{"data": [[1.794895791E12, 0.0], [1.79489579E12, 0.0], [1.794895788E12, 0.0], [1.794895787E12, 0.0], [1.794895763E12, 0.0], [1.794895764E12, 0.0], [1.794895765E12, 0.0], [1.794895762E12, 0.0], [1.794895769E12, 0.0], [1.79489577E12, 0.0], [1.794895766E12, 0.0], [1.794895767E12, 0.0], [1.794895768E12, 0.0], [1.794895776E12, 0.0], [1.794895775E12, 0.0], [1.794895774E12, 0.0], [1.794895771E12, 0.0], [1.794895772E12, 0.0], [1.794895773E12, 0.0], [1.794895781E12, 0.0], [1.79489578E12, 0.0], [1.794895779E12, 0.0], [1.794895778E12, 0.0], [1.794895777E12, 0.0], [1.794895786E12, 0.0], [1.794895785E12, 0.0], [1.794895784E12, 0.0], [1.794895783E12, 0.0], [1.794895782E12, 0.0]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794895791E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 2.0, "minX": 1.794895762E12, "maxY": 2013.977410947003, "series": [{"data": [[1.794895791E12, 1018.3214285714284], [1.79489579E12, 2.5], [1.794895788E12, 2.0], [1.794895787E12, 1915.4515477792738], [1.794895763E12, 2013.977410947003], [1.794895764E12, 2009.7703435804694], [1.794895765E12, 2007.4747838616704], [1.794895762E12, 2000.7894736842104], [1.794895769E12, 2009.7500000000002], [1.79489577E12, 2006.8131386861298], [1.794895766E12, 1965.2999120492514], [1.794895767E12, 1725.8983353151018], [1.794895768E12, 1939.0455284552845], [1.794895776E12, 1930.2200956937797], [1.794895775E12, 2003.1859813084104], [1.794895774E12, 2010.8154224774428], [1.794895771E12, 2009.2649739583346], [1.794895772E12, 2004.9653136531358], [1.794895773E12, 2000.314716312057], [1.794895781E12, 2002.471886120995], [1.79489578E12, 2006.978451715881], [1.794895779E12, 2005.923897581791], [1.794895778E12, 1845.6403079076283], [1.794895777E12, 1662.5050505050515], [1.794895786E12, 1855.6596858638768], [1.794895785E12, 2004.4423740510692], [1.794895784E12, 1972.4975206611573], [1.794895783E12, 1759.2789400278953], [1.794895782E12, 2000.555276381911]], "isOverall": false, "label": "read", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794895791E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 1.7976931348623157E308, "minX": 1.7976931348623157E308, "maxY": 4.9E-324, "series": [{"data": [], "isOverall": false, "label": "Max", "isController": false}, {"data": [], "isOverall": false, "label": "Min", "isController": false}, {"data": [], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [], "isOverall": false, "label": "Median", "isController": false}, {"data": [], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 4.9E-324, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 2001.0, "minX": 2.0, "maxY": 6026.5, "series": [{"data": [[2.0, 5006.5], [56.0, 6026.5], [1070.0, 2001.0], [1151.0, 2002.0], [1106.0, 2002.0], [1137.0, 2001.0], [1128.0, 2001.0], [1194.0, 2001.0], [1210.0, 2001.0], [1230.0, 2001.0], [1219.0, 2001.0], [1254.0, 2001.0], [1253.0, 2001.0], [1337.0, 2001.0], [1388.0, 2001.0], [1370.0, 2001.0], [1355.0, 2001.0], [1406.0, 2001.0], [1405.0, 2001.0], [1429.0, 2002.0], [1434.0, 2001.0], [1449.0, 2001.0], [1485.0, 2001.0], [1486.0, 2001.0], [1540.0, 2002.0], [1536.0, 2001.0], [1682.0, 2017.0], [19.0, 2001.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1682.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 0.0, "minX": 2.0, "maxY": 4.9E-324, "series": [{"data": [[2.0, 0.0], [56.0, 0.0], [1070.0, 0.0], [1151.0, 0.0], [1106.0, 0.0], [1137.0, 0.0], [1128.0, 0.0], [1194.0, 0.0], [1210.0, 0.0], [1230.0, 0.0], [1219.0, 0.0], [1254.0, 0.0], [1253.0, 0.0], [1337.0, 0.0], [1388.0, 0.0], [1370.0, 0.0], [1355.0, 0.0], [1406.0, 0.0], [1405.0, 0.0], [1429.0, 0.0], [1434.0, 0.0], [1449.0, 0.0], [1485.0, 0.0], [1486.0, 0.0], [1540.0, 0.0], [1536.0, 0.0], [1682.0, 0.0], [19.0, 0.0]], "isOverall": false, "label": "Failures", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1682.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 19.0, "minX": 1.79489576E12, "maxY": 1638.0, "series": [{"data": [[1.79489576E12, 19.0], [1.794895763E12, 1422.0], [1.794895764E12, 1107.0], [1.794895765E12, 1387.0], [1.794895761E12, 1358.0], [1.794895762E12, 1286.0], [1.794895769E12, 1538.0], [1.79489577E12, 1372.0], [1.794895766E12, 1138.0], [1.794895767E12, 1638.0], [1.794895768E12, 1274.0], [1.794895776E12, 1254.0], [1.794895775E12, 1070.0], [1.794895774E12, 1220.0], [1.794895771E12, 1536.0], [1.794895772E12, 1355.0], [1.794895773E12, 1127.0], [1.794895781E12, 1405.0], [1.79489578E12, 1253.0], [1.794895779E12, 1406.0], [1.794895778E12, 1429.0], [1.794895777E12, 1485.0], [1.794895785E12, 1421.0], [1.794895784E12, 1205.0], [1.794895783E12, 1434.0], [1.794895782E12, 1194.0]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794895785E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 1.0, "minX": 1.794895762E12, "maxY": 1540.0, "series": [{"data": [[1.794895791E12, 56.0], [1.79489579E12, 2.0], [1.794895766E12, 24.0], [1.794895767E12, 332.0], [1.794895788E12, 2.0], [1.794895768E12, 59.0], [1.794895787E12, 123.0], [1.794895776E12, 60.0], [1.794895772E12, 3.0], [1.794895773E12, 3.0], [1.794895779E12, 1.0], [1.794895778E12, 176.0], [1.794895777E12, 387.0], [1.794895786E12, 132.0], [1.794895784E12, 40.0], [1.794895783E12, 216.0], [1.794895782E12, 2.0]], "isOverall": false, "label": "Non HTTP response code: java.net.SocketTimeoutException", "isController": false}, {"data": [[1.794895787E12, 1363.0], [1.794895763E12, 1151.0], [1.794895764E12, 1106.0], [1.794895765E12, 1388.0], [1.794895762E12, 19.0], [1.794895769E12, 1540.0], [1.79489577E12, 1370.0], [1.794895766E12, 1113.0], [1.794895767E12, 1350.0], [1.794895768E12, 1171.0], [1.794895776E12, 1194.0], [1.794895775E12, 1070.0], [1.794895774E12, 1219.0], [1.794895771E12, 1536.0], [1.794895772E12, 1352.0], [1.794895773E12, 1125.0], [1.794895781E12, 1405.0], [1.79489578E12, 1253.0], [1.794895779E12, 1405.0], [1.794895778E12, 1253.0], [1.794895777E12, 1098.0], [1.794895786E12, 1205.0], [1.794895785E12, 1449.0], [1.794895784E12, 1170.0], [1.794895783E12, 1218.0], [1.794895782E12, 1192.0]], "isOverall": false, "label": "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 1.794895791E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 2.0, "minX": 1.794895762E12, "maxY": 1682.0, "series": [{"data": [[1.794895791E12, 56.0], [1.79489579E12, 2.0], [1.794895788E12, 2.0], [1.794895787E12, 1486.0], [1.794895763E12, 1151.0], [1.794895764E12, 1106.0], [1.794895765E12, 1388.0], [1.794895762E12, 19.0], [1.794895769E12, 1540.0], [1.79489577E12, 1370.0], [1.794895766E12, 1137.0], [1.794895767E12, 1682.0], [1.794895768E12, 1230.0], [1.794895776E12, 1254.0], [1.794895775E12, 1070.0], [1.794895774E12, 1219.0], [1.794895771E12, 1536.0], [1.794895772E12, 1355.0], [1.794895773E12, 1128.0], [1.794895781E12, 1405.0], [1.79489578E12, 1253.0], [1.794895779E12, 1406.0], [1.794895778E12, 1429.0], [1.794895777E12, 1485.0], [1.794895786E12, 1337.0], [1.794895785E12, 1449.0], [1.794895784E12, 1210.0], [1.794895783E12, 1434.0], [1.794895782E12, 1194.0]], "isOverall": false, "label": "read-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794895791E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 2.0, "minX": 1.794895762E12, "maxY": 1682.0, "series": [{"data": [], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [[1.794895791E12, 56.0], [1.79489579E12, 2.0], [1.794895788E12, 2.0], [1.794895787E12, 1486.0], [1.794895763E12, 1151.0], [1.794895764E12, 1106.0], [1.794895765E12, 1388.0], [1.794895762E12, 19.0], [1.794895769E12, 1540.0], [1.79489577E12, 1370.0], [1.794895766E12, 1137.0], [1.794895767E12, 1682.0], [1.794895768E12, 1230.0], [1.794895776E12, 1254.0], [1.794895775E12, 1070.0], [1.794895774E12, 1219.0], [1.794895771E12, 1536.0], [1.794895772E12, 1355.0], [1.794895773E12, 1128.0], [1.794895781E12, 1405.0], [1.79489578E12, 1253.0], [1.794895779E12, 1406.0], [1.794895778E12, 1429.0], [1.794895777E12, 1485.0], [1.794895786E12, 1337.0], [1.794895785E12, 1449.0], [1.794895784E12, 1210.0], [1.794895783E12, 1434.0], [1.794895782E12, 1194.0]], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 1000, "maxX": 1.794895791E12, "title": "Total Transactions Per Second"}},
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

