// requires for libraries
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import { getSession } from './services/sessionService'
import { getCommandResponse } from './services/commandService'
const config = require('config');
import models = require("./models")
import { getSpeechToText, getTextToSpeech } from "./services/speechService"

// application config
const port = process.env.WS_PORT || config.get('port')

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

    let session: any = await getSession(token)
    if (session.sessionId) {
        socket.data.sessionId = session.sessionId
        socket.data.clientId = session.clientID
        socket.join(socket.data.clientId)
        next()
    } else {
        console.log(`Socket disconnected due to invalid token`)
        socket.disconnect()
    }
});


io.on("connection", (socket: Socket) => {
    console.log(socket.data.clientId, "notification", `device:${socket.data.sessionId} attached on robot:${socket.data.clientId}`)

    socket.on("message", async (data: models.SocketMessage) => {

        if (data.type === "communication") {
            let payload: any = data.payload
            let response = await getCommandResponse(socket.data.sessionId, payload.message, payload.pageId, payload.sectionId, payload.entities, payload.uniqueConversationId)
            sendMessage(socket.data.clientId, "communication", response)

        } else if (data.type === "notification") {
            sendMessage(socket.data.clientId, "notification", data.payload)

        } else if (data.type === "voice") {
            let payload: any = data.payload
            let voiceResponse = await getSpeechToText(payload.message)
            if (voiceResponse) {
                let response: any = await getCommandResponse(socket.data.sessionId, voiceResponse, payload.pageId, payload.sectionId, payload.entities, payload.uniqueConversationId)
                console.log(payload, response);

                if (response?.intentName) {
                    if (payload.voice) {
                        response.audio = await getTextToSpeech(response.text)
                    }
                    sendMessage(socket.data.clientId, "communication", response)
                }
            }


        } else if (data.type === "tts") {
            let payload: any = data.payload
            let response: any = {}
            response.text = payload.message
            response.uniqueConversationId = payload.uniqueConversationId
            if (payload.voice) { response.audio = await getTextToSpeech(payload.message) }
            sendMessage(socket.data.clientId, "communication", response)

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
