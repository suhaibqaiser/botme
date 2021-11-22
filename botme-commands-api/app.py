from flask import Flask,jsonify,request
from controller.communication import getResponse
from controller.servicerasa import getIntent

app = Flask(__name__)

@app.route('/response',methods=['POST'])
def send_Response():
    req_data = request.get_json()
    text = req_data['text']
    pageId = req_data['pageId']
    sectionID = req_data['sectionId']
    rasa_data = getIntent(text)
    print(rasa_data)
    intent = rasa_data['intent']
    if(intent['name'] == "nlu_fallback"):
        print(1)
        response = {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?","ctaCommandId":None,"pageId":pageId,"sectionId":sectionID,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":0.0,"intentName":intent['name']}
        return jsonify(response)
    else:
        response = getResponse(intent['name'],rasa_data['entities'],text,pageId,sectionID)
        return jsonify(response)


if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=5010)