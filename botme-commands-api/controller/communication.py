from conf.mongodb import getDbCta
from textblob import TextBlob
import requests
import json


def getResponse(intent,entity,text,pageId,sectionId):
    blob =TextBlob(text)
    senti = blob.sentiment.polarity
    print(senti)
    value = parseEntityValue(entity)
    print(value)
    
    if ( -0.5 < senti < 0.5):
        if(intent == "unreserved_table_person"):
            tableResponse = searchingTable(value,senti,intent)
            return tableResponse
        elif(intent == "unexpected_answer"):
            return {"Response":"I need to know how many people are in your party to ensure that we can accomodate you.","ctaCommandId":None,"pageId":None,"sectionId":value,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        elif(intent == "Order_meal"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId)
            return Response
        elif(intent == 'thanks'):
            return {"Response":"your welcome","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        elif(intent == 'nlu_fallback'):
            return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        elif(intent == 'out_of_scope'):
            return {"Response":"Sorry, I can't handle that request","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        else:
            db = getDbCta(intent,value,pageId,sectionId)
            if db is not None:
                context = db['context']
                iD = getEntityId(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":context['pageId'],"sectionId":context['sectionId'],"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":senti,"intentName":intent} 
            else:
                return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'nlu_fallback'}

    elif(senti > 0.5):
        if(intent == "Order_meal"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId)
            return Response
        elif(intent == 'nlu_fallback'):
            return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'nlu_fallback'}
        else:
            db = getDbCta(intent,value,pageId,sectionId)
            if db is not None:
                sentimentResponse = db['sentimentResponse']
                return {"Response":sentimentResponse['positive'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti,"intentName":intent}
            else: 
                return {"Response":"I do not understand, Can you repeat it again","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'nlu_fallback'}

    elif(senti < -0.5):
        if(intent == "Order_meal"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId)
            return Response
        elif(intent == 'nlu_fallback'):
            return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'nlu_fallback'}
        else:
            db = getDbCta(intent,value,pageId,sectionId)
            if db is not None:
                sentimentResponse = db['sentimentResponse']
                return {"Response":sentimentResponse['positive'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti,"intentName":intent}
            else: 
                return {"Response":"I do not understand, Can you repeat it again","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'nlu_fallback'}

def parseEntityValue(entity):
    print(len(entity))
    for x in entity:
        if(len(entity) == 1):
            return x['value']
        elif(len(entity)>1):
            value = joinTwoEntity(x)
            return value
        elif(len(entity)==0):
            return None
    

def checkingForProduct(intent,value,senti,pageId,sectionId):
    try:
        response = requests.get('http://localhost:3100/food/product/search?productName='+value)
        data = response.json()
        print(data)
        if(data['status']=="success"):
            if(len(data['payload']) == 1):
                db = getDbCta(intent,value,pageId,sectionId)
                print(db)
                if(db == None or len(data['payload']) > 1):
                    return {"Response":"What do you mean by " + value + "?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'question'}
                else:
                    context = db['context']
                    print(context)
                    iD = getEntityId(context['entities'])
                    return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":context['pageId'],"sectionId":context['sectionId'],"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":senti,"intentName":intent} 
        else:
            return {"Response":"Product not available","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
    except:
        return "error in checking for product"

def searchingTable(value,senti,intent):
    try:
        response = requests.get('http://localhost:3100/food/tables/search?seats='+value)
        data = response.json()
        if(data['status'] == "success"):
            table_no = getTableNo(data['payload'])
            return {"Response":"you can move to the table number " + table_no,"ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        else:
            return {"Response":"Sorry, All tables are occupied","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
    except:
        return "error in searching for table"


def getTableNo(payload):
    for x in payload:
        number = str(x['tableLabel'])
        return number


def getEntityId(entity):
    for x in entity:
        return {"entityId":x['entityId'],"actionType":x['clickAttribute']}

def joinTwoEntity(entity):
    array = []
    array.append(entity['value'])
    value = array[0] +" "+ array[1]
    return value