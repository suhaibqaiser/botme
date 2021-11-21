import datetime
import socketio

sio = socketio.Client()

class Sockets:

    authToken = ""

    def __init__(self, token):
        print("Class called")
        self.authToken = token
        print("inside:" , self.authToken)
        if self.authToken:
            # Development WS String
            #sio.connect(url="ws://localhost:6380", auth={"token": self.authToken})
            # Production WS String
            sio.connect(url="wss://api.gofindmenu.com/ws/", socketio_path="/ws/", auth={"token": self.authToken})



    message_subject = {"payload": {"text": 'Waiting',
                                   "sentimentScore": 0, "intentName": ""}, "status": ""}
    notification_subject = {"text": "", "pageId": "", "sectionId": ""}

    @sio.event
    def connect(self):
        print('Connection established')

    @sio.event
    def connect_error(self):
        print("The connection failed!")

    @sio.on('message')
    def incoming(data):
        if data['type'] == "communication":
            if "payload" in data:
                print('Payload exists')
            else:
                print('Payload doesnt exists')
                data['payload'] = {"text": "This command doesnt exist in database, try something else!",
                                   "sentimentScore": 0.0, "intentName": "nlu_fallback"}
            Sockets.message_subject = data
        elif data['type'] == "notification":
            Sockets.notification_subject = data['payload']

    @sio.event
    def disconnect(self):
        print('Disconnected from server')

    # @sio.on('*')
    # def catch_all(event, sid, data):
    #     pass

    def send_message(self, type, message):
        msg = {
            "payload": {
                "text": message,
                "pageId": Sockets.notification_subject['pageId'],
                "sectionId": Sockets.notification_subject['sectionId']
            },
            "type": type,
            "timestamp": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S")
        }
        sio.emit('message', msg)

    def processing_start(self):
        self.send_message('notification', 'processing started')

    def processing_end(self):
        self.send_message('notification', 'processing ended')


