from flask import Flask,jsonify,request
from controller.communication import getResponse
from Service.servicerasa import getIntent
from conf.mongodb import findResponse
from controller.utility import Utility

app = Flask(__name__)

@app.route('/response',methods=['POST'])
def send_Response():
    req_data = request.get_json()
    text = req_data['text']
    pageId = req_data['pageId']
    sectionId = req_data['sectionId']
    form = req_data['entities']
    message = text.lower()
    rasa_data = getIntent(message)
    print(rasa_data)
    intent = rasa_data['intent']
    value = None
    db = None
    call = None
    utility = Utility(pageId,sectionId,value,text,intent['name'],db,form,call)
    if(intent['name'] == "nlu_fallback"):
        response = utility.nluFallBack()
        return jsonify(response)
    else:
        response = getResponse(intent['name'],rasa_data['entities'],text,pageId,sectionId,form)
        if response:
            return jsonify(response)
        else:
            response = utility.nluFallBack()
            return jsonify(response)

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=5010)