from conf.mongodb import getDbCta
from textblob import TextBlob
from controller.functions import parseEntityValue,checkingForProduct,searchingTable,getEntityClickAttribute,parseDate,parseTime


def getResponse(intent,entity,text,pageId,sectionId):
    blob =TextBlob(text)
    senti = blob.sentiment.polarity
    value = parseEntityValue(entity)
    print(value)
    db = getDbCta(intent,value,pageId,sectionId)
    
    if ( -0.5 < senti < 0.5):
        if (intent == "unreserved_table_person"):
            if db is not None:
                context = db['context']
                iD = getEntityClickAttribute(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":senti,"intentName":intent} 
            else:
                tableResponse = searchingTable(value,senti,intent)
                return tableResponse
        elif (intent == "Order_meal"or intent == "product-detail" or intent == "remove_item" or intent == "edit_product"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId)
            return Response
        elif (intent == "inform_date"):
            if db is not None:
                Response = parseDate(text,db,pageId,sectionId,intent,senti)
                return Response
        elif (intent == "inform_time"):
            if db is not None:
                Response = parseTime(text,db,pageId,sectionId,intent,senti)
                return Response
        else:
            if db is not None:
                context = db['context']
                iD = getEntityClickAttribute(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":senti,"intentName":intent} 
            else:
                return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'nlu_fallback'}

    elif(senti > 0.5):
        if(intent == "Order_meal"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId)
            return Response
        else:
            if db is not None:
                sentimentResponse = db['sentimentResponse']
                return {"Response":sentimentResponse['positive'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti,"intentName":intent}
            else: 
                return {"Response":"I do not understand, Can you repeat it again","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'nlu_fallback'}

    elif(senti < -0.5):
        if(intent == "Order_meal"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId)
            return Response
        else:
            if db is not None:
                sentimentResponse = db['sentimentResponse']
                return {"Response":sentimentResponse['positive'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":senti,"intentName":intent}
            else: 
                return {"Response":"I do not understand, Can you repeat it again","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":'nlu_fallback'}