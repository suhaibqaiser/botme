// requires for libraries
const WebSocket = require("ws");
const http = require("http");
const Request = require("./models/request");
const func = require("./functions/main");
const nlp = require("./nlp/nlp");
const port = process.env.WS_PORT || 6380;

// application initialization
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {

    ws.on('message', async function incoming(payload) {
        try {
            //let data = new Request(payload)
            //ws.send('Command: ' + func.extractCommand(data.message_text))
            res = await nlp.process(payload)
            ws.send('Intent: ' + res.intent + ' ' + res.score)
            ws.send('Response: ' + res.answer)
            ws.send('Command: ' + func.extractCommand(payload))
        } catch (e) {
            console.log('Error: ' + e)
            ws.send('Error: ' + e)
        }
    })
})

server.listen(port);
console.log("Websocket server started on port : " + port);
