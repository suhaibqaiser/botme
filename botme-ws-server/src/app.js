// requires for libraries
const os = require("os");
const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { randomInt } = require("crypto");

// application constants
const port = process.env.WS_PORT || 6380;
const apiServer = process.env.CLIENTS_API || 'http://localhost:3000/client/'
const bearerToken = 'ea2d3aeaad77865f9769974a920892f5'

// application initialization
const server = http.createServer();
const ws = new WebSocket.Server({ noServer: true });


// request router
server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/comms') {
        ws.handleUpgrade(request, socket, head, function done(wsws) {
            ws.emit('connection', wsws, request);

            wsws.isAlive = true;
            //console.log('Client connected ');
            axios
                .put(apiServer + 'register', {
                    clientName: randomInt(99999),
                    clientIp: request.socket.remoteAddress,
                    clientHostname: uuidv4(),
                    clientDeviceId: uuidv4(),
                    clientIsAlive: true
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + bearerToken
                    }
                }).then(res => {
                    console.log('statusCode :' + res.status)
                    //console.log(res.data.client)
                    wsws.clientId = res.data.client._id;
                    wsws.clientName = res.data.client.clientName;
                    wsws.clientIp = res.data.client.clientIp;
                    wsws.clientHostname = res.data.client.clientHostname;
                    wsws.clientDeviceId = res.data.client.clientDeviceId;
                }).catch(error => {
                    console.error(error)
                })
            wsws.on('pong', function heartbeat() {
                this.isAlive = true;
                axios
                    .post(apiServer + 'alive', {
                        clientId: wsws.clientId
                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + bearerToken
                        }
                    }).then(res => {
                        console.log('statusCode :' + res.status)
                        //console.log(res.data)
                    }).catch(error => {
                        console.error(error)
                    })
                //console.log('Client online...');
            });

            wsws.on('close', function close() {
                //console.log('Client disconnected!');
                axios
                    .post(apiServer + 'update', {
                        clientId: wsws.clientId,
                        clientName: wsws.clientName,
                        clientIp: wsws.clientIp,
                        clientHostname: wsws.clientHostname,
                        clientDeviceId: wsws.clientDeviceId,
                        clientIsAlive: false
                    }, {
                        headers: {
                            'Authorization': 'Bearer ' + bearerToken
                        }
                    }).then(res => {
                        console.log('statusCode :' + res.status)
                        //console.log(res.data)
                    }).catch(error => {
                        console.error(error)
                    })
                clearInterval(interval);
            }); String

            wsws.on('message', function incoming(message) {
                //console.log('Received Message:', message);
                wsws.send(Date() + ' | Message received at ' + os.hostname + ': ' + message);
            });
        });
    } else {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
    }

    function noop() {

    }
    const interval = setInterval(function ping() {
        ws.clients.forEach(function each(wsws) {
            if (wsws.isAlive === false) {
                return wsws.terminate();
            } else {
                wsws.isAlive = false;
                wsws.ping(noop);
            }
        });
    }, 30000);

});
server.listen(port);
console.log('Websocket server started on port : ' + port);