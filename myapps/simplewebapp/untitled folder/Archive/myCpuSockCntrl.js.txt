var myapp = angular.module('nvd3TestApp', [ 'nvd3' ]);

myapp.controller('MyCpuCntrl', function($scope, socket) {
    
    $scope.serverNames = [];
    //---------------*** Memory Chart Handler ***-------------------

    var MAX_SIZE =50;
    userCpuArray = []; systemCpuArray = [];
    $scope.cpuDdata = [];

    $scope.cpuOptions = {
        chart : {
            type : 'lineChart',
            height : 225,
            margin : {
                top : 10,
                right : 20,
                bottom : 20,
                left : 55
            },
            interpolate: 'linear',
            x : function(d) {
                return d.x;
            },
            y : function(d) {
                return d.y;
            },
            useInteractiveGuideline : true,
            dispatch : {
                stateChange : function(e) {
                    console.log("stateChange");
                },
                changeState : function(e) {
                    console.log("changeState");
                },
                tooltipShow : function(e) {
                    console.log("tooltipShow");
                },
                tooltipHide : function(e) {
                    console.log("tooltipHide");
                }
            },

            xAxis : {
                axisLabel : 'Time',
                tickFormat : function(d) { return d3.time.format("%H:%M:%S")(new Date(d)); }
            },
            yAxis : {
                axisLabel : 'CPU Utilization %',
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            },


            callback : function(chart) {
                console.log("!!! lineChart callback !!!");
                chart.forceY([0,90]);
                //chart.xScale = d3.time.scale();
                return chart;
            }/**/
        },
        title : {
            enable : true,
            text : 'CPU Monitor'
        },
        subtitle : {
            enable : false,
            text   : 'Realtime CPU Utilization',
            css : {
                'text-align' : 'center',
                'margin' : '10px 13px 0px 7px'
            }
        },
        caption : {
            enable : true,
            text : '',
            css : {
                'text-align' : 'justify',
                'margin' : '10px 13px 0px 7px'
            }
        }
    };
    function getCpuData(x1,y1,y2) {

        if(userCpuArray.length< MAX_SIZE){
            userCpuArray.push({
                x: x1, y: y1
            });
            systemCpuArray.push({
                x:x1, y:y2
            });
        }
        else{
            userCpuArray.shift();
            userCpuArray.push({
                x: x1, y: y1
            });
            systemCpuArray.shift();
            systemCpuArray.push({
                x:x1, y:y2
            });

        }
        return [
            {
                key: "User CPU %",
                values: userCpuArray,
                area : true,
                color: "#0000ff"
            },
            {
                key: "System CPU %",
                values: systemCpuArray,
                area : true,
                color: "#aa2211"
            }
        ];
    }
    function fetchTime(){
        var tme = (new Date()).getTime();
        var currTime = d3.time.format("%H:%M:%S").parse;
        return currTime;
    }

    socket.on('cpu', function(inp) { // Listening in Socket in
        // Angular Controller
        cpuObj = JSON.parse(inp.cpuJsonStr);
        x=(new Date()).getTime();
        //x=fetchTime().valueOf();
        y= cpuObj.cpu.user_cpu;
        y1 = cpuObj.cpu.systemCpu ;
        //alert(x+'--'+y+'#####'+$scope.data.toString());
        $scope.cpuData= getCpuData(x,y,y1);
        ipStr = cpuObj.cpu.ipAddress;
        ipIdx = $scope.serverNames.indexOf(ipStr);
        if(ipIdx < 0 ){
            $scope.serverNames.push(ipStr);
            alert('server Names'+$scope.serverNames +'--serverNames.length'+$scope.serverNames.length);
        }
    });
    //---------------*** Memory Chart Handler ***-------------------
    //var MAX_SIZE =50;
    memArray = [];
    $scope.memData = [];

    $scope.memOptions = {
        chart : {
            type : 'lineChart',
            height : 225,
            margin : {
                top : 10,
                right : 20,
                bottom : 20,
                left : 55
            },
            interpolate: 'linear',
            x : function(d) {
                return d.x;
            },
            y : function(d) {
                return d.y;
            },
            useInteractiveGuideline : false,
            dispatch : {
                stateChange : function(e) {
                    console.log("stateChange");
                },
                changeState : function(e) {
                    console.log("changeState");
                },
                tooltipShow : function(e) {
                    console.log("tooltipShow");
                },
                tooltipHide : function(e) {
                    console.log("tooltipHide");
                }
            },

            xAxis : {
                axisLabel : 'Time',
                tickFormat : function(d) { return d3.time.format("%H:%M:%S")(new Date(d)); }
            },
            yAxis : {
                axisLabel : 'Memory Utilization %',
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            },


            callback : function(chart1) {
                console.log("!!! lineChart callback !!!");
                chart1.forceY([0,100]);
                //chart.xScale = d3.time.scale();
            }/**/
        },
        title : {
            enable : true,
            text : 'Memory Monitor'
        },
        subtitle : {
            enable : false,
            text   : 'Realtime Memory Utilization',
            css : {
                'text-align' : 'center',
                'margin' : '10px 13px 0px 7px'
            }
        },
        caption : {
            enable : true,
            text : '',
            css : {
                'text-align' : 'justify',
                'margin' : '10px 13px 0px 7px'
            }
        }
    };
    function getMemData(x1,y1) {

        if(memArray.length< MAX_SIZE){
            memArray.push({
                x: x1, y: y1
            });
        }
        else{
            memArray.shift();
            memArray.push({
                x: x1, y: y1
            });
        }
        return [
            {
                key: "Memory %age Utilized",
                values: memArray,
                color: "#0000ff"
            }
            ];
    }
    function fetchTime(){
        var tme = (new Date()).getTime();
        var currTime = d3.time.format("%H:%M:%S").parse;
        return currTime;
    }

    socket.on('memory', function(inp) { // Listening in Socket in
              // Angular Controller
              memoryObj = JSON.parse(inp.memoryJsonStr);
              x=(new Date()).getTime();
              //x=fetchTime().valueOf();
              y= memoryObj.memory.usedMemPercent;
              //alert(x+'--'+y+'#####'+$scope.data.toString());
              $scope.memData= getMemData(x,y);
    });


    //---------------*** Network Chart Handler ***-------------------
    var MAX_NTWK_SIZE =50;
    networkRxArray = [];networkTxArray = [];
    var tempyRx=0; tempy1Rx=0;
    var tempyTx=0; tempy1Tx=0;

    $scope.networkData = [];

    $scope.networkOptions = {
        chart : {
            type : 'lineChart',
            height : 225,
            margin : {
                top : 10,
                right : 20,
                bottom : 20,
                left : 55
            },
            interpolate: 'linear', 
            x : function(d) {
                return d.x;
            },
            y : function(d) {
                return d.y;
            },
            useInteractiveGuideline : false,

            dispatch: {
                 stateChange : function(e) {
                    console.log("stateChange");
                },
                changeState : function(e) {
                    console.log("changeState");
                },
                tooltipShow : function(e) {
                    console.log("tooltipShow");
                },
                tooltipHide : function(e) {
                    console.log("tooltipHide");
                }
              
            }, 
            xAxis : {
                axisLabel : 'Time',
                tickFormat : function(d) { return d3.time.format("%H:%M:%S")(new Date(d)); }
            },
            yAxis : {
                axisLabel : 'Network - KB Received',
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: -10
            },


            callback : function(chart2) {
                console.log("!!! lineChart callback !!!");
                chart2.forceY([-50,50]);
                return chart2;
                //chart.xScale = d3.time.scale();
            }/**/

        },
        title : {
            enable : true,
            text : 'Network Monitor'
        },
        subtitle : {
            enable : false,
            text   : 'Realtime Network Utilization',
            css : {
                'text-align' : 'center',
                'margin' : '10px 13px 0px 7px'
            }
        },
        caption : {
            enable : true,
            text : '',
            css : {
                'text-align' : 'justify',
                'margin' : '10px 13px 0px 7px'
            }
        }
    };

    function getNetworkData(x1,yRx, yTx) {

        //alert('here in getNetworkData');
        arrayLength = networkRxArray.length;

        if(tempyRx < 1 && tempyTx < 1){
            networkRxArray.push({
                    x: x1, y: 0
            });

            networkTxArray.push({
                    x: x1, y: 0
            });
            networkTxArray.shift();
            networkRxArray.shift();
        }
        else {
            if(networkRxArray.length< MAX_NTWK_SIZE){
                tempyRx=(yRx-tempyRx)/1000; 
                networkRxArray.push({
                        x: x1, y: tempyRx
                });

                tempyTx=(tempyTx-yTx )/1000; 
                networkTxArray.push({
                        x: x1, y: tempyTx
                });

            }
            else{
                networkRxArray.shift();
                tempyRx=(yRx-tempyRx )/1000;   
                networkRxArray.push({
                        x: x1, y: tempyRx
                });

                networkTxArray.shift();
                tempyTx=(tempyTx-yTx )/1000;   
                networkTxArray.push({
                        x: x1, y: tempyTx
                });

            }
        }
        tempyRx=yRx; tempyTx = yTx

        return [
            {
                key: "KB Received",
                values: networkRxArray,
                area : true,
                color: "#0000ff"
            }
            , 
            {
                key: "KB Transmitted",
                values: networkTxArray,
                area : true,
                color: "#aa2211"
            }

            ];
    }
    function fetchTime(){
        //alert('here in network fetchTime');
        var tme = (new Date()).getTime();
        var currTime = d3.time.format("%H:%M:%S").parse;
        return currTime;
    }

    socket.on('network', function(inp) { // Listening in Socket in
        //alert('here in network socket.on');
        // Angular Controller
        networkObj = JSON.parse(inp.networkJsonStr);
        x=(new Date()).getTime();
        //x=fetchTime().valueOf();
        yRx= networkObj.network.rx_bytes;
        yTx= networkObj.network.tx_bytes;
        //alert(x+'--'+y+'#####'+$scope.data.toString());
        $scope.networkData= getNetworkData(x,yRx, yTx);
    });
});

//Getting value from server data change event
myapp.factory('socket', function($rootScope) {
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

