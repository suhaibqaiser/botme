// requires for libraries
const WebSocket = require('ws');
const http = require('http');
const config = require('./config');
const Request = require("./models/request");
const communicate = require("./utils/restUtil");
//const dbUtil = require('./utils/dbUtil');
//const queue = require('./utils/queue');

// application config
const port = config.port
const bearerToken = config.bearerToken
var sessions = {}

// application initialization
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {

    ws.on('message', async function incoming(payload) {

        let data = new Request(payload)

        if (data.authToken) {
            // FIXME: This is functional code commenting for testing

            // dbUtil.getSession(data.authToken, function (session) {
            //     if (session == null) {
            //         ws.send('HTTP/1.1 401 Unauthorized\r\n\r\n');
            //         ws.close();
            //         return;
            //     }
            //     console.log(session.clientID);
            //     ws.clientID = session.clientID;
            //     sessions[ws.clientID] = ws
            //     ws.send(JSON.stringify({ "clientID": session.clientID }));
            // });
            if (data.authToken === bearerToken) {
                response = await communicate.process(data.authToken, data.message_text)
                response.date = Date()
                ws.send(JSON.stringify(response))
            }


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