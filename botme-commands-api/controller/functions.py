from conf.mongodb import getDbCta
import requests

def parseEntityValue(entity):
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
        payload = data['payload']
        if(data['status']=="success"):
            if(len(data['payload']) == 1):
                db = getDbCta(intent,value,pageId,sectionId)
                print("2 => ", db)
                if(db == None):
                    return {"Response":"Product not found in database","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
                else:
                    context = db['context']
                    productID = parseProductId(payload)
                    iD = getEntityClickAttribute(context['entities'])
                    return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":productID,"actionType":iD['actionType'],"sentimentScore":senti,"intentName":intent}
            else:
                return {"Response":"What do you mean by " + value + "?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'question'}
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
            return {"Response":"you can move to the table number " + table_no,"ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        else:
            return {"Response":"Sorry, All tables are occupied","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
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
    array.append(entity['value'])
    value = array[0] +" "+ array[1]
    return value

def parseProductId(payload):
    for x in payload:
        return x['productId']