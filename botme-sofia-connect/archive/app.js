var mic = require('mic');
var fs = require('fs');
var tc = require('./translate');

var micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: true,
    exitOnSilence: 6
});
var micInputStream = micInstance.getAudioStream();

var outputFileStream = fs.WriteStream('output.raw');

micInputStream.pipe(outputFileStream);

micInputStream.on('data', function(data) {
    console.log("Recieved Input Stream: " + data.length);
});

micInputStream.on('error', function(err) {
    console.log("Error in Input Stream: " + err);
});

micInputStream.on('startComplete', function() {
    console.log("Got SIGNAL startComplete");
    setTimeout(function() {
        micInstance.stop();
    }, 10000);
});

micInputStream.on('stopComplete', function() {
    console.log("Got SIGNAL stopComplete");
});

micInputStream.on('pauseComplete', function() {
    console.log("Got SIGNAL pauseComplete");
    setTimeout(function() {
        micInstance.resume();
    }, 5000);
});

micInputStream.on('resumeComplete', function() {
    console.log("Got SIGNAL resumeComplete");
    setTimeout(function() {
        micInstance.stop();
    }, 5000);
});

micInputStream.on('silence', function() {
    console.log("Got SIGNAL silence");
    tc.quickstart().then(
        (response) => {
            process.exit(0);
        }, (error) => {
            console.log(error);
            process.exit(1);
        }
    )

});

micInputStream.on('processExitComplete', function() {
    console.log("Got SIGNAL processExitComplete");
});

micInstance.start();