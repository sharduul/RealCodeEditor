var express = require('express'),
http = require('http'),
sharejs = require('share').server;

var app = express();
  //.use(express.bodyParser())
  //.use(express.router)
  //.use(express.static('public'));
var server = http.createServer(app); 

var options = {db:{type:'none'}}; // See docs for options. {type: 'redis'} to enable     persistance.

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach(app, options);

//app.use(app.router); //Now router comes first and will be executed before static middleware
//

//app.use(app.router);

//app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);

server.listen(8000, function () {
    console.log('Server running at http://127.0.0.1:8000/');
});

app.get('/', function(req, res) {
	console.log("sdfasf");
	
	var circle = require('./test.js');
	// console.log( 'The area of a circle of radius 4 is '
           // + circle.area(4));
		   
		   
    res.redirect('index.html');
});

app.use(express.static(__dirname + '/public'));