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
				
				
				sftp.unlink( "testfile.py", function(err){ 
						
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
				var readStream = fs.createReadStream( "testfile.py" );
				var writeStream = sftp.createWriteStream( "testfile.py" );
				
				
				writeStream.on('end', function () {
				
					console.log( "sftp connection closed" );
					
				  });
				
 
				// what to do when transfer finishes
				writeStream.on(
					'close',
					function () {
					
						console.log( "- file transferred" );
						
						sftp.chmod( "testfile.py", 777, function(err){ 
						
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
						c.exec('python testfile.py', function(err, stream) {
							
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
  finish(['Awesome_armp1t']);
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
  username: 'scb8803',
  password: 'Awesome_armp1t',
  tryKeyboard: true
});