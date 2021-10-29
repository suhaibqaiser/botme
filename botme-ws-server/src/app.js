// requires for libraries
const config = require('./config');
const http = require('http');
const { Server } = require("socket.io");
const db = require('./utils/dbUtil');
const communicate = require("./controllers/communicationController");
//const queue = require('./utils/queue');

// application config
const port = config.port
const bearerToken = config.bearerToken

// application initialization
db.initDbConnection();
const server = http.createServer();
const options = {
    cors: {
        origin: '*',
    },
};
const io = new Server(server, options);

io.on("connection", (socket) => {
    io.emit("notification", `Socket ${socket.id} has connected`)
    console.log(`Socket ${socket.id} has connected`);

    socket.on("message", async (payload) => {
        let response = await communicate.processCommunication(payload)
        response.clientID = payload.clientID;
        sendMessage(response)
    });

    socket.on("notification", (data) => {
        console.log("notification", data);
    });

    function sendMessage(message) {
        socket.emit("message", message);
    }

    function sendNotification(message) {
        socket.emit("notification", message);
    }

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected`);
    })

});

server.listen(port);
console.log('Websocket server started on port : ' + port);
