// requires for libraries
const WebSocket = require("ws");
const http = require("http");
const Request = require("./models/request");
const func = require("./functions/main");
const port = process.env.WS_PORT || 6380;

// application initialization
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(payload) {
        try {
            let data = new Request(payload)
            ws.send('Command: ' + func.extractCommand(data.message_text))
        } catch (e) {
            console.log('Error:' + e)
        }
    })
})

server.listen(port);
console.log("Websocket server started on port : " + port);
