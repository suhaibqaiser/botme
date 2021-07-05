// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const authController = require('./controllers/authenticationController')
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const ccStreamer = new WebSocket('ws://localhost:6380/comms');
//const ccStreamer = new WebSocket('ws://54.165.125.65:6380/comms');

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "5000";
const router = express.Router();
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
app.use(express.static(__dirname + '/public')); // js, css, images
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(cookieParser());
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
let message = {};
message.message_format = "text"
message.message_command = "find"
message.language = "en-US"
message.message_text = "where is my gate 12"

ccStreamer.on('open', function open() {
    console.log("Web Socket backend connected")
});

io.on('connection', function (socket) {
    console.log('Websocket user connected');
});

io.on('connection', function (socket) {
    socket.on('chat message', (text) => {
        console.log('Message: ' + text);
        console.log('state: ' + ccStreamer._readyState);
        let clientMessage = JSON.parse(text);
        let clientToken = clientMessage.auth;
        message.message_text = clientMessage.command;
        message.authToken = clientToken;
        message.clientID = socket.id;
        console.log(message);
        if(message && message.message_text && clientToken) {
            ccStreamer.send(JSON.stringify(message))
        } else {
            io.to(socket.id).emit("You are not connected with server. Please refresh your browser")
        }


    });

});
ccStreamer.on("message", (responseData) => {
    let responseJSON = JSON.parse(responseData)
    console.log("Response: " + responseData)
    io.to(responseJSON.clientID).emit('bot reply', responseJSON.message)
});
/**
 * Routes Definitions
 */

router.post('/', authController.authenticateClient);

router.get('/', authController.navigateHome);

app.use('/', router)