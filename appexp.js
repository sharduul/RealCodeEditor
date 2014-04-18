
/*
previous version of file moved to archive. for future reference.
*/


var express = require('express'),
http = require('http'),
sharejs = require('share').server;

var app = express();
var server = http.createServer(app); 

var options = {db:{type:'none'}}; // See docs for options. {type: 'redis'} to enable     persistance.

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach(app, options);

app.use(express.static(__dirname + '/public'));

// routes ======================================================================
require('./app/routes.js')(app);


server.listen(8000, function () {
    console.log('Server running at http://127.0.0.1:8000/');
});


