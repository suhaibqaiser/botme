// requires for libraries
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import { getSession } from './services/sessionService'
import { getCommandResponse } from './services/commandService'
import config from './config.json'
import models = require("./models")

// application config
const port = process.env.WS_PORT || config.port

// application initialization
const httpServer = createServer();
const options = {
    cors: {
        origin: '*',
    },
};
const io = new Server(httpServer, options);


io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(token);

    let session: any = await getSession(token)
    if (session.sessionId) {
        socket.data.sessionId = session.sessionId
        socket.data.clientId = session.clientID
        console.log(`Session:${socket.data.sessionId}, clientId:${socket.data.clientId} has connected`)
        socket.join(socket.data.clientId)
        next()
    } else {
        console.log(`Socket Disconnected due to invalid token`)
        socket.disconnect()
    }
});


io.on("connection", (socket: Socket) => {
    sendMessage(socket.data.clientId, "notification", `device:${socket.data.sessionId} attached on robot:${socket.data.clientId}`)

    socket.on("message", async (data: models.SocketMessage) => {
        console.log(data);
        if (data.type === "communication") {
            let payload: any = data.payload
            let response = await getCommandResponse(socket.data.sessionId, payload.text, payload.pageId, payload.sectionId)
            sendMessage(socket.data.clientId, "communication", response)

        } else if (data.type === "notification") {
            sendMessage(socket.data.clientId, "notification", data.payload)

        } else if (data.type === "action") {
            

        } else if (data.type === "action callback") {


        } else {
            console.log(`Type "${data.type}" is not implemented`)
        }

    });

    function sendMessage(room: string, type: string, data: any) {
        let payload: models.SocketMessage = { payload: data, type: type, timestamp: Date() }
        io.to(room).emit("message", payload);
    }

    socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected because ${reason}`);
    })

});

httpServer.listen(port);
console.log('Websocket server started on port : ' + port);
