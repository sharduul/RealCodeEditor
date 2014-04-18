
var var_password = 'Awesome_armp1t';
var var_uname = 'scb8803';
var program_file_name = "program_to_run.c";
var program_result = "";
	
	
module.exports = function(app) {
	
	// api ---------------------------------------------------------------------
	
	// get the output of program
	app.get('/api/run_code/:code', function(req, res) {

		var code_to_run = unescape(req.params.code);
		
		write_to_file(program_file_name, code_to_run);
		run_ssh2(function(){
			console.log("test call back");
			console.log(program_result);
			
			res.json({output_text:program_result});
		});
		
		
		
	});

	

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.redirect('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};






// custom functions ======================================================================

// write the new code on file
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



// send the updated file to servers. run the program and get the results.
function run_ssh2(callback)
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
									//
									console.log((extended === 'stderr' ? 'STDERR: ' : 'STDOUT: ')
											  + data);
											  
									program_result = (extended === 'stderr' ? 'STDERR: ' : '') + data;
									
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
	  callback();
	});
	c.connect({
	  host: 'glados.cs.rit.edu',
	  port: 22,
	  username: var_uname,
	  password: var_password,
	  tryKeyboard: true
	});


}
