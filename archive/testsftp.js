var fs = require('fs');
var ssh2 = require('ssh2');
 
var conn = new ssh2();
 
conn.on(
    'connect',
    function () {
        console.log( "- connected" );
    }
);
 
conn.on(
    'ready',
    function () {
        console.log( "- ready" );
 
        conn.sftp(
            function (err, sftp) {
                if ( err ) {
                    console.log( "Error, problem starting SFTP: %s", err );
                    process.exit( 2 );
                }
 
                console.log( "- SFTP started" );
 
                // upload file
                var readStream = fs.createReadStream( "testfile.py" );
                var writeStream = sftp.createWriteStream( "testfile.py" );
 
                // what to do when transfer finishes
                writeStream.on(
                    'close',
                    function () {
                        console.log( "- file transferred" );
                        sftp.end();
                        process.exit( 0 );
                    }
                );
 
                // initiate transfer of file
                readStream.pipe( writeStream );
            }
        );
    }
);
 
conn.on(
    'error',
    function (err) {
        console.log( "- connection error: %s", err );
        process.exit( 1 );
    }
);

conn.on('keyboard-interactive', function(name, instructions, instructionsLang, prompts, finish) {
  console.log('Connection :: keyboard-interactive');
  finish(['Awesome_armp1t']);
});
 
conn.on(
    'end',
    function () {
        process.exit( 0 );
    }
);
 
conn.connect({
  host: 'glados.cs.rit.edu',
  port: 22,
  username: 'scb8803',
  password: 'Awesome_armp1t',
  tryKeyboard: true
});