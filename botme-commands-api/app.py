from flask import Flask,jsonify,request
from controller.communication import getResponseUsingContext
from Service.servicerasa import getIntent
from conf.mongodb import insertingWrongResponseInDb
from controller.utility import Utility

app = Flask(__name__)

@app.route('/response',methods=['POST'])
def send_Response():
    req_data = request.get_json()
    # REQUEST JSON
    context = req_data['context']
    inputText = req_data['inputText']
    converstion = req_data['conversation']

    # INITIALIZATION
    text = inputText['textValue']
    pageId = context['pageId']
    sectionId = context['sectionId']
    form = context['entities']
    parentEntity = context['parentEntity']
    message = text.lower()

    # RASA API CALL
    rasa_data = getIntent(message)
    intent = rasa_data['intent']

    # RESPONSE RETURN
    value = None
    db = None
    call = None
    utility = Utility(pageId,sectionId,value,text,intent['name'],db,form,call)
    if(intent['name'] == "nlu_fallback"):
        response = utility.nluFallBack()
        wrongCommand = insertingWrongResponseInDb(converstion['conversationId'],converstion['conversationLogId'],context['clientId'],context['sessionId'],response,text)
        return jsonify(response)
    else:
        response = getResponseUsingContext(intent['name'],rasa_data['entities'],text,pageId,sectionId,form,parentEntity,converstion,context)
        if response:
            return jsonify(response)
        else:
            print("taha")
            response = utility.nluFallBack()
            wrongCommand = insertingWrongResponseInDb(converstion['conversationId'],converstion['conversationLogId'],converstion['clientId'],converstion['sessionId'],response,text)
            return jsonify(response)

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=5010)