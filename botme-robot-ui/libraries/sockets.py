import datetime
import websocket
import json

class Sockets:

    def send(self, payload):
        wsPayload = {
            "clientID": "987530c0-998d-4cfc-b86d-596b5f7cd7d7",
            "current_time": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S"),
            "message_format": "text",
            "message_command": "find",
            "language": "en-US",
            "message_text": payload,
            "authToken": "qbw/fcQKvC6SY+AelUs5VpRYOhnRvzZsz39xVU06LYI="
        }
        ws = websocket.create_connection("ws://localhost:6380")

        ws.send(json.dumps(wsPayload))

        result = ws.recv()
        result = json.loads(result)

        ws.close()
        return result['message']['text']
