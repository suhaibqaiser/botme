from flask import Flask,jsonify,request
from controller.communication import getResponse
from controller.servicerasa import getIntent
from timefhuman import timefhuman
import datetime

app = Flask(__name__)

@app.route('/response',methods=['POST'])
def send_Response():
    req_data = request.get_json()
    text = req_data['text']
    print(text)
    pageId = req_data['pageId']
    print(pageId)
    sectionID = req_data['sectionId']
    timefhuman('noon next week')
    rasa_data = getIntent(text)
    print(rasa_data)
    intent = rasa_data['intent']
    response = getResponse(intent['name'],rasa_data['entities'],text,pageId,sectionID)
    return jsonify(response)


if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=5010)