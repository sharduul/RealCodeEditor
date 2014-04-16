var Connection = require('ssh2');

var c = new Connection();
c.on('ready', function() {
  console.log('Connection :: ready');
  c.exec('python hello.py', function(err, stream) {
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
    });
    stream.on('exit', function(code, signal) {
      console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
      c.end();
    });
  });
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