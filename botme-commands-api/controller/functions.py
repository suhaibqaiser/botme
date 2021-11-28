from conf.mongodb import getDbCta
import requests
import dateparser
from timefhuman import timefhuman
from datetime import datetime


def parseEntityValue(entity):
    for x in entity:
        if(len(entity) == 1):
            return x['value']
        elif(len(entity)>1):
            if (x['extractor'] == "SpacyEntityExtractor"):
                return x['value']
            else:
                value = joinTwoEntity(entity)
                return value
        elif(len(entity)==0):
            return None
    
def checkingForProduct(intent,value,senti,pageId,sectionId,text):
    try:
        response = requests.get('http://localhost:3100/food/product/search?productName='+value)
        data = response.json()
        payload = data['payload']
        if(data['status']=="success"):
            if(len(data['payload']) == 1):
                db = getDbCta(intent,value,pageId,sectionId)
                if(db != None):
                    context = db['context']
                    productID = parseProductId(payload)
                    iD = getEntityClickAttribute(context['entities'])
                    if(sectionId == "sectionId-cart-modal"):
                        name = value.title()
                        return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":productID+name,"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent}
                    else:
                        return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":productID,"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent}
                else:
                    return {"Response":"Product not found in database","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent} 
            else:
                return {"Response":"What do you mean by " + value + "?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":'question'}
        else:
            return {"Response":"Product not available","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
    except:
        return "error in checking for product"

def searchingTable(value,senti,intent,text):
    try:
        response = requests.get('http://localhost:3100/food/tables/search?seats='+value)
        data = response.json()
        if(data['status'] == "success"):
            table_no = getTableNo(data['payload'])
            return {"Response":"you can move to the table number " + table_no,"ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
        else:
            return {"Response":"Sorry, All tables are occupied","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
    except:
        return "error in searching for table"

def getTableNo(payload):
    for x in payload:
        number = str(x['tableLabel'])
        return number

def getEntityClickAttribute(entity):
    for x in entity:
        return {"entityId":x['entityId'],"actionType":x['clickAttribute']}

def joinTwoEntity(entity):
    array = []
    for x in entity:
        array.append(x['value'])
    value = " ".join(array)
    return value

def parseProductId(payload):
    for x in payload:
        return x['productId']

def parseDate(text,db,pageId,sectionId,intent,senti):
    context = db['context']
    iD = getEntityClickAttribute(context['entities'])
    try:
        t = dateparser.parse(text)
        print("time =>" ,t)
        if t is not None:
            print("dateparser call")
            time = t.strftime("%Y-%m-%d")
            print(time)
        else:
            print("timefhuman call")
            now = datetime.now()
            t = timefhuman(text,now=now)
            print(t)
            time = t.strftime("%Y-%m-%d")
            print(time)
        return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":time,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent}     
    except:
        return "Error in parsing date"

def parseTime(text,db,pageId,sectionId,intent,senti):
    context = db['context']
    iD = getEntityClickAttribute(context['entities'])
    try:
        t = dateparser.parse(text)
        print("time =>" ,t)
        if t is not None:
            print("dateparser call")
            time = t.strftime("%H:%M:%S")
            print(time)
        else:
            print("timefhuman call")
            now = datetime.now()
            t = timefhuman(text,now=now)
            print(t)
            time = t.strftime("%H:%M:%S")
            print(time)
        return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":time,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent}     
    except:
        return "Error in parsing date"