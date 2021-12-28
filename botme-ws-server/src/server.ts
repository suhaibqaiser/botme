// requires for libraries
import {createServer} from "http"
import {Server, Socket} from "socket.io"
import {getSession} from './services/sessionService'
import {getCommandResponse} from './services/commandService'

const config = require('config');
import models = require("./models")
import {getSpeechToText, getTextToSpeech} from "./services/speechService"
import {
    addConversation,
    addConversationLog,
    endConversation,
    updateConversationLog
} from "./services/conversationService";
import {responseJson} from "./models";

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


io.on("connection", async (socket: Socket) => {
    console.log(socket.data.clientId, "notification", `device:${socket.data.sessionId} attached on robot:${socket.data.clientId}`)
    socket.data.conversationId = await addConversation(socket.data.sessionId)

    socket.on("message", async (data) => {
        let payload: any = data
        console.log(payload)


        let conversationLogId = await addConversationLog(socket.data.conversationId)
        let conversation = {
            conversationId: socket.data.conversationId,
            conversationLogId: conversationLogId,
            conversationSequence: payload.context.conversationSequence
        }

        if (data.context.type === "communication") {
            let response = await getCommandResponse(payload.inputText.textValue, payload.context.pageId, payload.context.sectionId, payload.context.entities, conversation)
            sendMessage(socket.data.clientId, "communication", response)

        } else if (data.context.type === "notification") {
            sendMessage(socket.data.clientId, "notification", data)

        } else if (data.context.type === "voice") {

            let socketInput = JSON.parse(JSON.stringify(payload))
            delete socketInput.inputText.textValue
            updateConversationLog(conversationLogId, 'socketInput', socketInput)
            console.log(payload)
            let voiceResponse = await getSpeechToText(payload.inputText.textValue)

            if (voiceResponse) {
                updateConversationLog(conversationLogId, 'query', voiceResponse)

                let response: any = await getCommandResponse(voiceResponse, payload.context.pageId, payload.context.sectionId, payload.context.entities, conversation)
                updateConversationLog(conversationLogId, 'response', response.outputText.textValue)


                response.audio = await getTextToSpeech(response.outputText.textValue)
                sendMessage(socket.data.clientId, "communication", response)
                delete response.audio
                updateConversationLog(conversationLogId, 'socketOutput', response)

            } else {

                let response: responseJson = {
                    ctaId: null,
                    inputText: {
                        language: "",
                        textValue: "",
                        timestamp: Date()
                    },
                    outputText: {
                        language: "english",
                        textValue: "I didnt understand, please say it again",
                        timestamp: Date()
                    },
                    context: {
                        pageId: "",
                        sectionId: "",
                        parentEntity: {
                            entityId: null,
                            entityValue: null
                        },
                        entities: [
                            {
                                clickAttribute: null,
                                entityId: "",
                                entityValue: "",
                                keywords: null,
                                entitySelected: false
                            }
                        ]
                    },
                    action: [
                        {
                            actionType: null,
                            actionId: null,
                            actionValue: null
                        }
                    ],
                    conversation: {
                        conversationId: conversation.conversationId,
                        conversationLogId: conversation.conversationLogId,
                        conversationSequence: conversation.conversationSequence,
                    }
                }

                sendMessage(socket.data.clientId, "communication", response)

                updateConversationLog(conversationLogId, 'socketOutput', response)
            }


        } else if (data.context.type === "tts") {
            let response: any = {}
            response.text = payload.inputText.textValue
            response.conversation = conversation
            response.audio = await getTextToSpeech(payload.inputText.textValue)

            sendMessage(socket.data.clientId, "communication", response)

        } else {
            console.log(`Type "${data.context.type}" is not implemented`)
        }

    });

    function sendMessage(room: string, type: string, data: any) {
        let payload: models.SocketMessage = {payload: data, type: type, timestamp: Date()}
        io.to(room).emit("message", payload);
    }

    socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected because ${reason}`);
        endConversation(socket.data.conversationId)
    })

});

httpServer.listen(port);
console.log('Websocket server started on port : ' + port);
