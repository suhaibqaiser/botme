from flask import Flask,jsonify,request
from conf.mongodb import getDbCta
from flask_pymongo import MongoClient
from controller.communication import getResponse
from controller.servicerasa import getIntent
import json

app = Flask(__name__)

@app.route('/response',methods=['POST'])
def send_Response():
    body={}
    req_data = request.get_json()
    text = req_data['text']
    rasa_data = getIntent(text)
    print(rasa_data)
    intent = rasa_data['intent']
    response = getResponse(intent['name'],rasa_data['entities'],text)
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)