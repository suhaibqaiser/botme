import requests
from config import RASA_URL
import json


def getIntent(text):
    try:
        message = {"text":text}
        body = json.dumps(message)
        response = requests.post(RASA_URL ,body, headers={'Content-Type': 'application/json'})
        data = response.json()
        return data
    except:
         return "error getting intent from rasa"
    
