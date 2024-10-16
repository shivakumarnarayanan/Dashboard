//---------------*** CPU Monitor Global Variables ***-------------------
userCpuArray = []; systemCpuArray = [];

//---------------*** CPU Monitor Global Variables ***-------------------
//---------------*** Memory Monitor Global Variables ***----------------
memArray = [];

//---------------*** Memory Monitor Global Variables ***----------------
//---------------*** Network Monitor Global Variables ***----------------
var MAX_NTWK_SIZE =50;
networkRxArray = [];networkTxArray = [];
var tempyRx=0; tempy1Rx=0;
var tempyTx=0; tempy1Tx=0;

//---------------*** Network Monitor Global Variables ***----------------
//---------------*** Top Process Monitor Global Variables ***----------------
topData='';
//topData = $scope.topData;
//---------------*** Top Process Monitor Global Variables ***----------------

function cpuMonitorData(x1,y1,y2)
    {
        var MAX_SIZE =50;
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
    }
    function getMemData(x1,y1){
        var MAX_SIZE =50;
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
    }
   
    function getNetworkData(x1,yRx, yTx){
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
    }
   
