from flask import Flask,jsonify,request
from conf.mongodb import getDbCta
from flask_pymongo import MongoClient
from controller.communication import getResponse
from controller.servicerasa import getIntent
import json

app = Flask(__name__)

@app.route('/response',methods=['POST'])
def send_Response():
    req_data = request.get_json()
    text = req_data['text']
    print(text)
    pageId = req_data['pageId']
    print(type(pageId))
    sectionID = req_data['sectionId']
    rasa_data = getIntent(text)
    print(rasa_data)
    intent = rasa_data['intent']
    response = getResponse(intent['name'],rasa_data['entities'],text,pageId,sectionID)
    return jsonify(response)


if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=5010)