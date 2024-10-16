angular.module('plunker.services', [])
.factory('DataService', function() {
    return {
        cpuChart: {
          options: cpuMonitorChartOptions,
          data: cpuMonitorData
        }, 
        memoryChart: {
          options: memoryMonitorChartOptions,
          data: memoryMonitorData
        }, 
        networkChart: {
          options: networkMonitorChartOptions,
          data: networkMonitorData
        },
        topProcess: {
          options: topProcessOptions,
          data: topProcessData
        }/*, 
        candlestickBarChart: {
          options: candlestickBarChartOptions,
          data: candlestickBarChartData
        }  */
    };
  
    function cpuMonitorChartOptions() {
	  return {
            chart: {
                type: 'lineChart',
                margin : {
                    top: 40,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                interpolate: 'linear', 
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: 'Time (sec)',
                    axisLabelDistance: -1,
                    tickFormat : function(d) { return d3.time.format("%H:%M:%S")(new Date(d)); }
                },
                yAxis: {
                    axisLabel: 'CPU Utilization %',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                }, 
                showLegend: false,
                callback : function(chart) {
                    console.log("!!! lineChart callback !!!");
                    chart.forceY([0,95]);
                    //chart.xScale = d3.time.scale();
                    return chart;
                }/**/
            }
        };  
	};
    
    
    function cpuMonitorData() {
        return [
            {
                key: "User CPU %",
                values: userCpuArray, //defined in controller
                area : true,
                color: "#ff7f0e"
            },
            {
                key: "System CPU %",
                values: systemCpuArray, //defined in controller
                area : true,
                color: "#7777ff"
            }
        ];
	};
    
    function memoryMonitorChartOptions() {
	  return {
        chart: {
                type: 'lineChart',
                margin : {
                    top: 40,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                interpolate: 'linear', 
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: 'Time (sec)',
                    axisLabelDistance: -1,
                    tickFormat : function(d) { return d3.time.format("%H:%M:%S")(new Date(d)); }
                },
                yAxis: {
                    axisLabel: 'Memory Utilization %',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                }, 
                showLegend: false,
                callback : function(chart) {
                    console.log("!!! lineChart callback !!!");
                    chart.forceY([0,95]);
                    //chart.xScale = d3.time.scale();
                    return chart;
                }/**/
            }
      };
    }
    function memoryMonitorData() {
        return [
            {
                key: "Used Mem %",
                values: memArray, //defined in controller
                area : false,
                color: "#ff0000"
            }
        ];
	};
    function networkMonitorChartOptions() {
	  return {
        chart: {
                type: 'lineChart',
                margin : {
                    top: 40,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: 'Time (sec)',
                    axisLabelDistance: -1,
                    tickFormat : function(d) { return d3.time.format("%H:%M:%S")(new Date(d)); }
                },
                yAxis: {
                    axisLabel: 'Network Utilization %',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                }, 
                showLegend: false,
                callback : function(chart) {
                    console.log("!!! lineChart callback !!!");
                    chart.forceY([-50,50]);
                    //chart.xScale = d3.time.scale();
                    return chart;
                }/**/
            }
      };
    }
    function networkMonitorData() {
       return [
            {
                key: "KB Received",
                values: networkRxArray,
                area : true,
                color: "#11aa00"
            }
            , 
            {
                key: "KB Transmitted",
                values: networkTxArray,
                area : true,
                color: "#aa2211"
            }

            ];
	};
    function topProcessOptions(){
        return '<div> {{topData}} </div>';    
    };
    function topProcessData() {
        alert('####****'+topData);
        return topData;
	};
  
})
//Getting value from server data change event
.factory('socket', function($rootScope) {
    var socket = io.connect('', {'force new connection': true});
    return {
        on: function(eventName, callback) { // Return callback to the actual
            // function to manipulate it.
            socket.on(eventName, function() {
                var args = arguments;   
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        }
    };
});
