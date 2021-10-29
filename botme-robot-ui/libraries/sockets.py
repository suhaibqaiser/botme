import datetime
import socketio
from rx import of

sio = socketio.Client()

class Sockets:
    messageSubject = 'Waiting'
    notification = ''

    @sio.event
    def connect():
        print('Connection established')
        sio.emit('notification', 'hello')

    @sio.event
    def connect_error():
        print("The connection failed!")

    @sio.on('message')
    def incoming(data):
        print(data)
        Sockets.messageSubject = data['message']['text']

    @sio.on('notification')
    def incoming(data):
        print(data)
        # Sockets.notification = data['message']['text']

    @sio.event
    def disconnect():
        print('Disconnected from server')

    def sendMessage(self, message):
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

    def sendNotification(self, message):
        payload = {
            "clientID": "987530c0-998d-4cfc-b86d-596b5f7cd7d7",
            "current_time": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S"),
            "message_format": "text",
            "message_command": "find",
            "language": "en-US",
            "message_text": message,
            "authToken": "qbw/fcQKvC6SY+AelUs5VpRYOhnRvzZsz39xVU06LYI="
        }
        sio.emit('notification', payload)

    sio.connect('http://localhost:6380')
