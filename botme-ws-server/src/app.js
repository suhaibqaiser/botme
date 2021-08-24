// requires for libraries
const config = require('./config');
const WebSocket = require('ws');
const http = require('http');
const db = require('./utils/dbUtil');
const communicate = require("./controllers/communicationController");
//const queue = require('./utils/queue');

// application config
const port = config.port
const bearerToken = config.bearerToken

// application initialization
db.initDbConnection();
const server = http.createServer();
const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws) {
    console.log('Client Connected');
    

    ws.on('message', async function incoming(payload) {
        let response = await communicate.processCommunication(payload)
        let parsedPayload = JSON.parse(payload)
        response.clientID = parsedPayload.clientID;
        console.log(response)
        ws.send(JSON.stringify(response))
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

})
;

server.listen(port);
console.log('Websocket server started on port : ' + port);