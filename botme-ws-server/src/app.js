// requires for libraries
const config = require('./config');
const http = require('http');
const { Server } = require("socket.io");
const db = require('./utils/dbUtil');
const communicate = require("./controllers/communicationController");
const sessionService = require("./services/sessionService")
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
    // Challanging socket to authenticate before connection
    socket.emit("auth", "login")

    socket.on("auth", async (token) => {
        session = await sessionService.getSession(token)
        if (session) {
            socket.sessionId = session.sessionId
            socket.clientId = session.clientID
            console.log(`Session:${socket.sessionId}, clientId:${socket.clientId} has connected`)
            socket.join(socket.clientId)
            socket.to(socket.clientId).emit("notification",`${socket.sessionId} joined room:${socket.clientId}`)
        } else {
            socket.disconnect()
        }
    })

    socket.on("message", async (payload) => {
        let response = await communicate.processMessage(socket.sessionId, socket.conversationId, payload)
        if (response.status === "success") {
            socket.conversationId = response.conversationId
            sendMessage(socket.clientId, response)
        }
    });

    socket.on("notification", (data) => {
        console.log("notification", data);
        sendNotification(data)
    });

    function sendMessage(room, message) {
        console.log(room, message);
        io.to(room).emit("message", message);
    }

    function sendNotification(room, message) {
        socket.to(room).emit("notification", message);
    }

    socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected because ${reason}`);
    })

});

server.listen(port);
console.log('Websocket server started on port : ' + port);
