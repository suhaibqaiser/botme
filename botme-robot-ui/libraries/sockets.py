import datetime
import socketio
import json

sio = socketio.Client()


class Sockets:
    message_subject = {"payload": {"text": 'Waiting',
                                   "sentimentScore": 0, "intentName": ""}, "status": ""}
    notification_subject = ''

    @sio.event
    def connect(self):
        print('Connection established')

    @sio.event
    def connect_error(self):
        print("The connection failed!")

    @sio.on('message')
    def incoming(data):
        print(data)
        if data['type'] == "communication":
            Sockets.message_subject = data
        elif data['type'] == "notification":
            Sockets.notification_subject = data['payload']

    @sio.event
    def disconnect(self):
        print('Disconnected from server')

    def send_message(self, type, message):
        msg = {
            "payload": {"text": message,
                        "pageId": "pageId-order-online",
                        "sectionId": "sectionId-product-list"
            },
            "type": type,
            "timestamp": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S")
        }
        sio.emit('message', msg)

    def processing_start(self):
        self.send_message('notification', 'processing started')

    def processing_end(self):
        self.send_message('notification', 'processing ended')

    authToken = {"token": 'LvsVhA3Yx0JED98w/L/5olOgrtHPmt1UB7JMMOxOncQ='}
    sio.connect('http://localhost:6380', auth=authToken)
