var var_password = 'Awesome_armp1t';
var var_uname = 'scb8803';
var program_file_name = "program_to_run.c";

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

server.listen(8000, function () {
    console.log('Server running at http://127.0.0.1:8000/');
});

app.get('/', function(req, res) {
	console.log("test root");
    res.redirect('index.html');
});

app.get('/run_program', function(req, res) {
	console.log("empty program");
    res.redirect('/index.html');
});

app.get('/run_program/:sharetext', function(req, res) {
	console.log("test run program");
	//console.log(req.params.sharetext);

	write_to_file(program_file_name, req.params.sharetext);
	run_ssh2();
	
	//ssh2 = require('./testssh2.js'); // commented intentionally. keep it for reference.
    res.redirect('/index.html');
});



app.use(express.static(__dirname + '/public'));



function write_to_file(path, content)
{
	var fs = require('fs');
	fs.writeFile(path, content, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
		}
	}); 
}



function run_ssh2()
{

	var Connection = require('ssh2');
	var fs = require('fs');

	var c = new Connection();
	c.on('ready', function() {
	  console.log('Connection :: ready');
	  
	  c.sftp(
				function (err, sftp) {
					if ( err ) {
						console.log( "Error, problem starting SFTP: %s", err );
						//process.exit( 2 );
					}
	 
					console.log( "- SFTP started" );
					
					
					sftp.unlink( program_file_name, function(err){ 
							
						if ( err ) {
							console.log( "Error, problem starting SFTP: %s", err );
							//process.exit( 2 );
						}
						else
						{
							console.log( "file unlinked" );
						}
					
					});
	 
					// upload file
					var readStream = fs.createReadStream(program_file_name);
					var writeStream = sftp.createWriteStream(program_file_name);
					
					
					writeStream.on('end', function () {
					
						console.log( "sftp connection closed" );
						
					  });
					
	 
					// what to do when transfer finishes
					writeStream.on(
						'close',
						function () {
						
							console.log( "- file transferred" );
							
							sftp.chmod( program_file_name, 777, function(err){ 
							
								if ( err ) {
									console.log( "Error, problem starting SFTP: %s", err );
									//process.exit( 2 );
								}
								else
								{
									console.log( "Mode changed" );
								}
							
							});
							
							
							
							//execute the program
							c.exec('gcc -o testc ' + program_file_name + ' && ./testc', function(err, stream) {
								
								if (err) throw err;
								stream.on('data', function(data, extended) {
								  console.log((extended === 'stderr' ? 'STDERR: ' : 'STDOUT: ')
											  + data);
								});
								stream.on('end', function() {
								  console.log('Stream :: EOF');
								});
								stream.on('close', function() {
									console.log('Stream :: close');
									
									// close the ftp connection
									sftp.end();
									// fs.end();
									//process.exit( 0 );
								  
								});
								stream.on('exit', function(code, signal) {
								  console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
								  c.end();
								});
							  });
							
	  
	  
	  
							
						}
					);
	 
					// initiate transfer of file
					readStream.pipe( writeStream );
				}
			);
			
			
	  
	  
	  
	});
	c.on('keyboard-interactive', function(name, instructions, instructionsLang, prompts, finish) {
	  console.log('Connection :: keyboard-interactive');
	  finish([var_password]);
	});
	c.on('error', function(err) {
	  console.log('Connection :: error :: ' + err);
	});
	c.on('end', function() {
	  console.log('Connection :: end');
	});
	c.on('close', function(had_error) {
	  console.log('Connection :: close');
	});
	c.connect({
	  host: 'glados.cs.rit.edu',
	  port: 22,
	  username: var_uname,
	  password: var_password,
	  tryKeyboard: true
	});


}
