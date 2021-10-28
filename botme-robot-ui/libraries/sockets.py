import datetime
import socketio
import asyncio
import json


class Sockets:
    io = socketio.AsyncClient()

    @io.event
    async def connect():
        print('connection established')

    @io.event
    async def message(data):
        wsPayload = {
            "clientID": "987530c0-998d-4cfc-b86d-596b5f7cd7d7",
            "current_time": datetime.datetime.now().strftime("%a %b %d %Y %H:%M:%S"),
            "message_format": "text",
            "message_command": "find",
            "language": "en-US",
            "message_text": data,
            "authToken": "qbw/fcQKvC6SY+AelUs5VpRYOhnRvzZsz39xVU06LYI="
        }
        await io.emit('message', json.dumps(wsPayload))

    @io.event
    async def disconnect():
        print('disconnected from server')

    async def main():
        await io.connect('http://localhost:6380')
        await io.wait()

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
