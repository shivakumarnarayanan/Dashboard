var net = require('net');
var d = require('domain').create();

var HOST = '127.0.0.1';
var PORT = 8787;
var TERMINAL_CHAR = '\n';
var SEPARATOR_CHAR = '#';

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
    console.log('Server Listening on' + HOST +':'+ PORT);
});

d.on('error', function(err){
     console.log(err);
     console.log('Server Listening on ' + HOST +':'+ PORT);
});


// catch the uncaught errors in this asynchronous or synchronous code block
d.run(function(){
    // Create a server instance
    net.createServer(function(sock) {
                               
        // We have a connection - a socket object is assigned to the connection automatically
        console.log('CONNECTED'+ sock.remoteAddress +':'+ sock.remotePort);
                                                       
        // Add a 'data' event handler to this instance of socket
        sock.on('data', function(data) {
            console.log('Data Received by ' + sock.remoteAddress );
            var full_msg = data.toString();
            console.log(full_msg);
        });
                                                       
        // Add a 'close' event handler to this instance of socket
        sock.on('close', function(data) {
                console.log('CLOSED');
                });
        }).listen(PORT, HOST);
        
        console.log('Server Listening on ' + HOST +':'+ PORT);
});
