from flask import Flask,jsonify,request
from controller.communication import getResponse
from Service.servicerasa import getIntent
from conf.mongodb import findResponse

app = Flask(__name__)

@app.route('/response',methods=['POST'])
def send_Response():
    req_data = request.get_json()
    text = req_data['text']
    pageId = req_data['pageId']
    sectionID = req_data['sectionId']
    form = req_data['entities']
    message = text.lower()
    rasa_data = getIntent(message)
    intent = rasa_data['intent']
    if(intent['name'] == "nlu_fallback"):
        number = "1"
        response = {"Response": findResponse(number),"ctaCommandId":None,"pageId":pageId,"sectionId":sectionID,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent['name']}
        return jsonify(response)
    else:
        response = getResponse(intent['name'],rasa_data['entities'],text,pageId,sectionID,form)
        if response:
            return jsonify(response)
        else:
            number = "1"
            response = {"Response":findResponse(number),"ctaCommandId":None,"pageId":pageId,"sectionId":sectionID,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent['name']}
            return response




if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=5010)