// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
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

io.on('connection', function(socket){
    console.log('a user connected');
});
io.on('connection', function(socket) {
    socket.on('chat message', (text) => {
        console.log('Message: ' + text);

        console.log('Bot reply: ' + text);
        socket.emit('bot reply', text);



    });
});
/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});
