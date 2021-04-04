// requires for libraries
const WebSocket = require('ws');
const http = require('http');
const dbUtil = require('./utils/dbUtil');
const rm = require('./utils/queue');

// application constants
const port = process.env.WS_PORT || 6380;
const apiServer = process.env.CLIENTS_API || 'http://localhost:3000/client/'
const bearerToken = 'ea2d3aeaad77865f9769974a920892f5'
var sessions = {}

// application initialization
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(response) {
        console.log(response);
        message = JSON.parse(response);

        if (message.hasOwnProperty('authToken')) {
            dbUtil.getSession(message.authToken, function (session) {
                if (session == null) {
                    ws.send('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    ws.close();
                    return;
                }
                console.log(session.clientID);
                ws.clientID = session.clientID;
                sessions[ws.clientID] = ws
                ws.send(JSON.stringify({ "clientID": session.clientID }));
            });
        } else {
            console.log(message);
        }
    });

    // TODO: set interval timeout to 0 when deploying
    setInterval(async function () {
        var recMessage = await rm.receiveMessage();
        if (recMessage.clientID) {

            var clientID = recMessage.clientID;
            var command = recMessage.command;
            if (sessions.hasOwnProperty(clientID))
                sessions[clientID].send(JSON.stringify({ "clientID": clientID, "command": command }));

            rm.deleteMessage(recMessage.ReceiptHandle);
        }
    }, 5000);

});

server.listen(port);
console.log('Websocket server started on port : ' + port);