
var express = require('express'),
http = require('http'),
sharejs = require('share').server;

var app = express();
	// commented intentionally. keep it for reference.
	//.use(express.bodyParser())
	//.use(express.router)
	//.use(express.static('public'));
var server = http.createServer(app); 

var options = {db:{type:'none'}}; // See docs for options. {type: 'redis'} to enable     persistance.

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach(app, options);

// commented intentionally. keep it for reference.
//app.use(app.router);
//app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);


app.use(express.static(__dirname + '/public'));

// routes ======================================================================
require('./app/routes.js')(app);


server.listen(8000, function () {
    console.log('Server running at http://127.0.0.1:8000/');
});



/*

app.get('/', function(req, res) {
	//console.log("test root");
    res.redirect('index.html');
});

app.get('/run_program', function(req, res) {
	//console.log("empty program");
    res.redirect('/index.html');
});

app.get('/run_program/:sharetext', function(req, res) {
	
	//console.log(req.params.sharetext);
	
	

	write_to_file(program_file_name, req.params.sharetext);
	
	
	run_ssh2(function(){
		console.log("test call back");
		//console.log(program_result);
		//res.send('hello world');
		
		//console.log(program_result);
		//res.write('<title>Internal Server Error</title>\n');
		//res.redirect('/index.html', {reg_error:'username'});
	});
	//ssh2 = require('./testssh2.js'); // commented intentionally. keep it for reference.	
	
	
});


*/


