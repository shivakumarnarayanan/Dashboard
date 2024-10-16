/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

//'use strict';
//module.exports = require('./lib/express');

var socket = io.connect('', {'force new connection': true});
//alert('I am here after connect');

socket.on('cpu', function(data){
    // Create a list item to add to the page.
    var li = document.createElement('li');
  
    // Create an element for each piece of data in the phone call object.
    var cpuStats = document.createElement('h4');

    // Set the display text for each element.
    //JSON.stringify(data[1])
    cpuObj = JSON.parse(data.cpuJsonStr);
    //alert(jsonStr +"######"+cpuObj);
    cpuStats.textContent = 'System CPU ' + cpuObj.cpu.systemCpu +'   '+
                           'User CPU   ' + cpuObj.cpu.user_cpu   +'   '+
                           'Idle CPU   ' + cpuObj.cpu.idleCpu ;
          
    // Append each line of text to our phone call list item.
    li.appendChild(cpuStats);
    
    // Append the new object to the #phone-calls div.
    document.getElementById('cpu').appendChild(li);
});

socket.on('memory', function(data){
    
    // Create a list item to add to the page.
    var li = document.createElement('li');
  
    // Create an element for each piece of data in the phone call object.
    var memStats = document.createElement('h4');

    // Set the display text for each element.
    //alert(JSON.stringify(data) );
    memObj = JSON.parse(data.memoryJsonStr);
    //alert(jsonStr +"######"+memObj.memory.usedMemPercent);
    memStats.textContent = 'Used Memory ' + memObj.memory.usedMemPercent +'%   '+
                           'Free Memory ' + memObj.memory.freeMemPercent +'%   ' ;
          
    // Append each line of text to our phone call list item.
    li.appendChild(memStats);
    
    // Append the new object to the #phone-calls div.
    document.getElementById('memory').appendChild(li);
});

