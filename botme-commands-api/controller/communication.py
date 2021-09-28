from conf.mongodb import getDbCta ,searchBySectionId
from textblob import TextBlob
import requests
import json


def getResponse(intent,entity,text):
    blob =TextBlob(text)
    senti = blob.sentiment.polarity
    print(senti)
    value = parseEntityValue(entity)
    
    if ( -0.5 < senti < 0.5):
        if(intent == "unreserved_table_person"):
            tableResponse = searchingTable(value)
            return tableResponse
        elif(intent == "unexpected_answer"):
            return {"Response":"I need to know how many people are in your party to ensure that we can accomodate you."}
        elif(intent == "Order_meal"):
            Response = checkingForProduct(intent,value,senti)
            return Response
        elif(intent == 'nlu_fallback'):
            return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?"}
        elif(intent == 'next'):
            sectionId = input('give the SectionID: ')
            db = searchBySectionId(intent,value,sectionId)
            print(db)
            return {"Response":db['response']}
        elif(intent == 'Back'):
            sectionId = input('give the SectionID: ')
            db = searchBySectionId(intent,value,sectionId)
            print(db)
            return {"Response":db['response']}
        else:
            db = getDbCta(intent,value)
            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti}

    elif(senti > 0.5):
        db = getDbCta(intent,value)
        if db is not None:
            sentimentResponse = db['sentimentResponse']
            return {"Response":sentimentResponse['positive'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti}
        elif(intent == 'nlu_fallback'):
            return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?"}
        else:
            return {"Response":"I do not understand, Can you repeat it again"}
    elif(senti < -0.5):
        db = getDbCta(intent,value)
        if db is not None:
            sentimentResponse = db['sentimentResponse']
            return {"Response":sentimentResponse['negative'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti}
        elif(intent == 'nlu_fallback'):
            return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?"}
        else:
            return {"Response":"I do not understand, Can you repeat it again"}

def parseEntityValue(entity):
    for x in entity:
        return x['value']

def checkingForProduct(intent,value,senti):
    response = requests.get('http://localhost:3100/food/product/search?productName='+value)
    data = response.json()
    print(data)
    if(data['status']=="success"):
        if(len(data['payload']) == 1):
            db = getDbCta(intent,value)
            if(db == None):
                return {"Response":"What do you mean by " + value + "?"}
            else:
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti}
        elif(len(data['payload']) > 1):
            return {"Response":"What do you mean by " + value + " ?"}
    else:
        return {"Response":"Product not available"}


def searchingTable(value):
    response = requests.get('http://localhost:3100/food/tables/search?seats='+value)
    data = response.json()
    if(data['status'] == "success"):
        table_no = getTableNo(data['payload'])
        return {"Response":"you can move to the table number " + table_no}
    else:
        return {"Response":"Sorry, All tables are occupied"}

def getTableNo(payload):
    for x in payload:
        number = str(x['tableLabel'])
        return number

