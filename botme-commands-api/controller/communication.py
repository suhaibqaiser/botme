from conf.mongodb import getDbCta
from textblob import TextBlob
import requests
# import json


def getResponse(intent,entity,text):
    # intent1 = intent
    blob =TextBlob(text)
    senti = blob.sentiment.polarity
    print(senti)
    value = getEntityValue(entity)
    # ent = value.title()
    # db = getDbCta(intent,value)
    # sentimentResponse = db['sentimentResponse']
    # if(intent1 == intent):
    if ( -0.5 < senti < 0.5):
        if(intent == "unreserved_table_person"):
            response = requests.get('http://localhost:3100/food/tables/search?seats='+value)
            data = response.json()
            print(data)
            if(data['status'] == "success"):
                table_no = getTable(data['payload'])
                return {"Response":"you can move to the table number " + table_no}
            else:
                return {"Response":"Sorry, All tables are occupied"}
        elif(intent == "Order_meal"):
            response = requests.get('http://localhost:3100/food/product/search?searchText='+value)
            data = response.json()
            print(data)
            if(data['status']=="success"):
                if(len(data['payload']) == 1):
                    db = getDbCta(intent,value)
                    print(type(db))
                    if(db == None):
                        return {"Response":"What do you mean by " + value + "?"}
                    else:
                        sentimentResponse = db['sentimentResponse']
                        return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti}
                elif(len(data['payload']) > 1):
                    return {"Response":"What do you mean by " + value + " ?"}
        elif(intent == 'nlu_fallback'):
            return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?"}
        else:
            db = getDbCta(intent,value)
            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti}

        # elif(intent == "next"):
        #     if(sectionid == 'S1')
    elif(senti > 0.5):
        db = getDbCta(intent,value)
        if db is not None:
            sentimentResponse = db['sentimentResponse']
            return {"Response":sentimentResponse['positive'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti}
        else:
            return {"Response":"I do not understand, Can you repeat it again"}
    elif(senti < -0.5):
        db = getDbCta(intent,value)
        if db is not None:
            sentimentResponse = db['sentimentResponse']
            return {"Response":sentimentResponse['negative'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti}
        else:
            return {"Response":"I do not understand, Can you repeat it again"}

def getEntityValue(entity):
    for x in entity:
        return x['value']

def getTable(payload):
    for x in payload:
        number = str(x['tableLabel'])
        return number

