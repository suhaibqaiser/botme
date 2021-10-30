import datetime
import socketio

sio = socketio.Client()

class Sockets:
    message_subject = 'Waiting'
    notification_subject = ''

    @sio.event
    def connect(self):
        print('Connection established')
        sio.emit('notification', 'hello')

    @sio.event
    def connect_error(self):
        print("The connection failed!")

    @sio.on('message')
    def incoming(data):
        print(data)
        Sockets.message_subject = data['message']['text']

    @sio.on('notification')
    def incoming(data):
        print(data)
        Sockets.notification_subject = data['message']['text']

    @sio.event
    def disconnect(self):
        print('Disconnected from server')

    def send_message(self, message):
        payload = {
            "clientID": "987530c0-998d-4cfc-b86d-596b5f7cd7d7",
            "current_time": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S"),
            "message_format": "text",
            "message_command": "find",
            "language": "en-US",
            "message_text": message,
            "authToken": "qbw/fcQKvC6SY+AelUs5VpRYOhnRvzZsz39xVU06LYI=",
            "pageId": "pageId-order-online",
            "sectionId": "sectionId-product-list"
        }
        sio.emit('message', payload)

    def send_notification(self, message):
        payload = {
            "current_time": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S"),
            "language": "en-US",
            "message_text": message
        }
        sio.emit('notification', payload)

    def processing_start(self):
        self.send_notification('processing started')

    def processing_end(self):
        self.send_notification('processing ended')

    sio.connect('http://localhost:6380')
