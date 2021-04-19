// requires for libraries
const config = require('./config');
const WebSocket = require('ws');
const http = require('http');
const db = require('./utils/dbUtil');
const Request = require("./models/request");
const Response = require("./models/response");
const communicate = require("./controllers/communicationController");
const conversation = require("./controllers/conversationController");
const session = require("./controllers/sessionsController");
//const queue = require('./utils/queue');

// application config
const port = config.port
const bearerToken = config.bearerToken

// application initialization
db.initDbConnection();

// async function init() {
//     console.log(await session.validateSession('+g8HdQiQJ7IjBkvjtRt8Ipk6CYN/PZPC4lJHCsfDiMk='))
// }
// init()

const server = http.createServer();
const wss = new WebSocket.Server({server});
// let sessions = {}
//
wss.on('connection', function connection(ws) {

    ws.on('message', async function incoming(payload) {
        let data = new Request(payload)
        if (data.authToken) {
            let response = new Response()
            let v = await session.validateSession(data.authToken)
            if (v.status === 'success' && v.payload === true) {
                let c = await communicate.processCommunication(data.message_text)
                response.message = c.payload
                response.status = c.status
            } else {
                let response = new Response()
                response.message = v.payload
                response.status = v.status
            }
            ws.send(JSON.stringify(response))
        } else {
            ws.send('authToken not found')
        }
    });

    // TODO: set interval timeout to 0 when deploying

    // FIXME: This is functional code commenting for testing
    // setInterval(async function () {
    //     // receive message from SQS
    //     var recMessage = await queue.receiveMessage();
    //     if (recMessage.clientID) {

    //         var clientID = recMessage.clientID;
    //         var command = recMessage.command;
    //         if (sessions.hasOwnProperty(clientID))
    //             sessions[clientID].send(JSON.stringify({ "clientID": clientID, "command": command }));

    //         queue.deleteMessage(recMessage.ReceiptHandle);
    //     }
    // }, 50000);

});

server.listen(port);
console.log('Websocket server started on port : ' + port);