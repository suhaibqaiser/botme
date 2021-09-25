import requests
from config import RASA_URL
import json


def getIntent(text):
    message = {"text":text}
    body = json.dumps(message)
    response = requests.post(RASA_URL ,body, headers={'Content-Type': 'application/json'})
    data = response.json()

    return data
