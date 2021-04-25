// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const WebSocket = require('ws');
const ccStreamer = new WebSocket('ws://localhost:6380/comms');
//const ccStreamer = new WebSocket('ws://54.165.125.65:6380/comms');

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "5000";

/**
 * Server Activation
 */
const server = app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
const io = require('socket.io')(server);
/**
 *  App Configuration
 */
app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images
let message = {};
message.authToken = "x7YofjlSv3HeCbG5DjaKL4TIiLt3WRo7/lNtUPVkBBo="
message.message_format = "text"
message.message_command = "find"
message.language = "en-US"
message.message_text = "where is my gate 12"

ccStreamer.on('open', function open() {
    console.log("Web Socket backend connected")
});

io.on('connection', function(socket){
    console.log('Websocket user connected');
});

io.on('connection', function(socket) {
    socket.on('chat message', (text) => {
        console.log('Message: ' + text);
        console.log('state: ' + ccStreamer._readyState);
        message.message_text = text;
        console.log(socket.id);
        ccStreamer.send(JSON.stringify(message))

    });
    ccStreamer.on("message", (responseData) => {
        let responseJSON = JSON.parse(responseData)
        console.log("Response: " + responseData)
        socket.emit('bot reply', responseJSON.message)
    });
});
/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});
