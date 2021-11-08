import datetime
import socketio
import json

sio = socketio.Client()


class Sockets:
    message_subject = {"message": {"text": 'Waiting',
                                   "sentimentScore": 0, "intentName": ""}, "status": ""}
    notification_subject = ''

    auth = 'LvsVhA3Yx0JED98w/L/5olOgrtHPmt1UB7JMMOxOncQ='
    
    @sio.event
    def connect(self):
        print('Connection established')

    @sio.event
    def connect_error(self):
        print("The connection failed!")

    # @sio.on('auth')
    # def incoming(data):
    #     if data == 'login':
    #         # TODO: Update code with functioning token
    #         authToken = 'LvsVhA3Yx0JED98w/L/5olOgrtHPmt1UB7JMMOxOncQ='
    #         sio.emit('auth', authToken)

    @sio.on('message')
    def incoming(data):
        print(data)
        Sockets.message_subject = data

    @sio.on('notification')
    def incoming(data):
        print(data)
        Sockets.notification_subject = data

    @sio.event
    def disconnect(self):
        print('Disconnected from server')

    def send_message(self, message):
        payload = {
            "current_time": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S"),
            "text": message,
            "pageId": "pageId-order-online",
            "sectionId": "sectionId-product-list"
        }
        sio.emit('message', payload)

    def send_notification(self, message):
        payload = {
            "current_time": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S"),
            "text": message
        }
        sio.emit('notification', payload)

    def processing_start(self):
        self.send_notification('processing started')

    def processing_end(self):
        self.send_notification('processing ended')

    sio.connect('http://localhost:6380')
