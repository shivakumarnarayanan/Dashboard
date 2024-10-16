"use strict";
const express = require('express');
const app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 8787;

//----------------Socket IO Conf Start ------------------------//
var io = require("socket.io")();
io.serveClient(true);
io.attach(server);

// Set socket.io listeners.
io.on('connection', function(socket){
    console.log('a user connected');
      
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

//----------------Socket IO Conf End --------------------------//

//----------------Body Parser Conf Start ----------------------//
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//----------------Body Parser Conf End ------------------------//

app.use(express.static(__dirname+'/'));
app.use("/node_modules", express.static('node_modules'));

var publicDir = process.argv[2] || __dirname+'/public';
var path = require('path');

var debug = require('debug')('simplewebapp');

//-------------- POST requests Handler - Client Service Threads - CPU, Memory, Network, Process, Swap -------------//
app.post('/cpu', function(req, res, next) {
    var cpuJson = req.body;
    var cpuJsonStr = JSON.stringify(cpuJson);
    
    io.emit('cpu', {cpuJsonStr});
    console.log('CPU post data --> '+ cpuJsonStr);
    res.end('yes');
});
app.post('/memory', function(req, res, next) {
    var memoryJson = req.body;
    var memoryJsonStr = JSON.stringify(memoryJson);
         
    io.emit('memory', {memoryJsonStr});
    console.log('Memory post data --> '+ memoryJsonStr);
    res.end('yes');
});
app.post('/network', function(req, res, next) {
    var networkJson = req.body;
    var networkJsonStr = JSON.stringify(networkJson);
         
    io.emit('network', { networkJsonStr } );
    console.log('Network post data --> '+ networkJsonStr);
    res.end('yes');
});
app.post('/top', function(req, res, next) {
    var topJson = req.body;
    var topJsonStr = JSON.stringify(topJson);
         
    io.emit('top', { topJsonStr } );
    console.log('Top Process post data --> '+ topJsonStr);
    res.end('yes');
});

app.post('/process', function(req, res, next) {
    var processJson = req.body;
    var processJsonStr = JSON.stringify(processJson);
         
    io.emit('process', { processJsonStr } );
    console.log('Process post data --> '+ processJsonStr);
    res.end('yes');
});
app.post('/swap', function(req, res, next) {
    var swapJson = req.body;
    var swapJsonStr = JSON.stringify(swapJson);
         
    io.emit('swap', { swapJsonStr } );
    console.log('Swap post data --> '+ swapJsonStr);
    res.end('yes');
});

/** --------------End of POST requests Hanlder ------------------------**/


/** --------------GET requests Handler ---------------------------------*/
app.get('/', function(req, res, next) {
    console.log('data received');
    res.sendFile(path.join('/index.html'));
});

app.get('/^(.+)$/', function(req,res){
    console.log('Static file Request : '+req.params);
    res.sendFile(__dirname);
});
/** --------------End of GET requests Hanlder ------------------------**/

// Run server to listen on port .
server.listen(port, function(){
    debug('listening on *: '+ port);
});

module.exports = app;