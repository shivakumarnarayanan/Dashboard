var app = angular.module('plunker', ['nvd3', 'gridster', 'plunker.services','smart-table','lrDragNDrop']);

app
.controller('MainCtrl', function($scope, $timeout, DataService, socket) {
  //---------------*** CPU Monitor Global Variables ***-------------------
	$scope.serverNames = [];
    $scope.serverNames = [];
    $scope.cpuDdata = [];
    //---------------*** CPU Monitor Global Variables ***-------------------
    //---------------*** Memory Monitor Global Variables ***----------------
   
    $scope.memData = [];
    //---------------*** Memory Monitor Global Variables ***----------------
    //---------------*** Network Monitor Global Variables ***----------------
    $scope.networkData = [];
    //---------------*** Network Monitor Global Variables ***----------------
    //---------------*** Top Process Monitor Global Variables ***----------------
    $scope.topdata;
    
    $scope.columnNames=['pid', 'user','run time','mem','cpu time', 'cpu%','name'];
    $scope.columnKeys=['pid', 'user','processRunTime','memFootPrint','cpuTime', 'cpuPercent','processName'];
    $scope.isLoading = false;
    $scope.rowCollection = [];

    //---------------*** Top Process Monitor Global Variables ***----------------
        
    
    $scope.gridsterOptions = {
		margins: [20, 20],
		columns: 4,
		mobileModeEnabled: false,
		draggable: {
			handle: 'h3'
		},
		resizable: {
            enabled: true,
            handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

            // optional callback fired when resize is started
            start: function(event, $element, widget) {},

            // optional callback fired when item is resized,
            resize: function(event, $element, widget) {
                if (widget.chart.api) widget.chart.api.update();
            }, 
    
            // optional callback fired when item is finished resizing 
            stop: function(event, $element, widget) {
                $timeout(function(){
                    if (widget.chart.api) widget.chart.api.update();
                },400)
            } 
        },
	};
	
	$scope.dashboard = {
		widgets: [ {
			col: 2,
			row: 0,
			sizeY: 2,
			sizeX: 2,
            align: 'center', 
			name: "Network Monitor",
			chart: {
			  options: DataService.networkChart.options(),
			  data: DataService.networkChart.data(),
			  api: {} 
			}
		}, 
       
        {
			col: 0,
			row: 2,
			sizeY: 2,
			sizeX: 3,
			name: "CPU Monitor",
			chart: {
			  options: DataService.cpuChart.options(),
			  data: DataService.cpuChart.data(),
			  api: {} 
			}
		}, 
        {
			col: 0,
			row: 0,
			sizeY: 2,
			sizeX: 2,
			name: "Memory Monitor",
			chart: {
			  options: DataService.memoryChart.options(),
			  data: DataService.memoryChart.data(),
			  api: {} 
			}
		}]
    };
    $scope.textboard = {
		widgets: [ 
        {
			col: 0,
			row: 3,
			sizeY: 2,
			sizeX: 2,
			name: "Top Processes",
            textContent:{
              options: DataService.topProcess.options(),
              data: DataService.topProcess.data(),
			  api: {} 
			}
		}]
	};
  
    // We want to manually handle `window.resize` event in each directive.
    // So that we emulate `resize` event using $broadcast method and internally subscribe to this event in each directive
    // Define event handler
    $scope.events = {
        resize: function(e, scope){
          $timeout(function(){
            scope.api.update()
          },200)
        }
    };
    angular.element(window).on('resize', function(e){
        $scope.$broadcast('resize');
    });

    // We want to hide the charts until the grid will be created and all widths and heights will be defined.
    // So that use `visible` property in config attribute
    $scope.config = {
        visible: false
    };
    $timeout(function(){
        $scope.config.visible = true;
    }, 200);
    
    socket.on('cpu', function(inp) { // Listening in Socket in
        // Angular Controller
        cpuObj = JSON.parse(inp.cpuJsonStr);
        x=(new Date()).getTime();

        y= cpuObj.cpu.user_cpu;
        y1 = cpuObj.cpu.systemCpu ;

        $scope.cpuData= cpuMonitorData(x,y,y1);
        ipStr = cpuObj.cpu.ipAddress;
        ipIdx = $scope.serverNames.indexOf(ipStr);
        if(ipIdx < 0 ){
            $scope.serverNames.push(ipStr);
            //alert('server Names'+$scope.serverNames +'--serverNames.length'+$scope.serverNames.length);
        }
    });
    socket.on('memory', function(inp) { // Listening in Socket in
              // Angular Controller
              memoryObj = JSON.parse(inp.memoryJsonStr);
              x=(new Date()).getTime();
              //x=fetchTime().valueOf();
              y= memoryObj.memory.usedMemPercent;
              //alert(x+'--'+y+'#####'+$scope.data.toString());
              $scope.memData= getMemData(x,y);
    });
    socket.on('network', function(inp) { // Listening in Socket in
        networkObj = JSON.parse(inp.networkJsonStr);
        x=(new Date()).getTime();
        yRx= networkObj.network.rx_bytes;
        yTx= networkObj.network.tx_bytes;
        $scope.networkData= getNetworkData(x,yRx, yTx);
    });
    socket.on('top', function(inp) { // Listening in Socket in
        topArrayList = JSON.parse(inp.topJsonStr);
        //clean up table content
        tableLen = $scope.rowCollection.length;
        for(i=0;i<tableLen;i++){
            $scope.rowCollection.shift();
        }
        //alert('tableLen--'+tableLen);
        //alert('topArrayList.top.length--'+topArrayList.top.length);
        for (i=0;i< 9;i++){
            var
                pid = topArrayList.top[i].pid,
                user = topArrayList.top[i].user,
                processRunTime = topArrayList.top[i].processRunTime,
                memFootPrint = topArrayList.top[i].memFootPrint,
                cpuTime =topArrayList.top[i].cpuTime,
                cpuPercent = topArrayList.top[i].cpuPercent,
                processName = topArrayList.top[i].processName;   
            //alert('tableRow--'+pid+'--user--'+user+'--processRunTime--'+processRunTime+'--memFootPrint--'+memFootPrint+'--cpuTime--'+cpuTime+'--cpuPercent--'+cpuPercent+'--processName--'+processName);   
                procName  = processName.substring(processName.lastIndexOf('/'));
                
                //procName = (temp.lastIndexOf('.')>0)? temp.subString(temp.lastIndexOf('.')):temp;
            $scope.rowCollection.push(
                {
                    pid: pid,
                    user: user,
                    processRunTime: processRunTime,
                    memFootPrint: memFootPrint,
                    cpuTime: cpuTime,
                    cpuPercent : cpuPercent,
                    processName: procName
                }
            );    
        }
    });
});
