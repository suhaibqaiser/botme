from conf.mongodb import getDbCta
from textblob import TextBlob
from controller.functions import parseEntityValue,checkingForProduct,searchingTable,getEntityClickAttribute,parseDate,parseTime
import re

# reminder need to change text to senti in responses

def getResponse(intent,entity,text,pageId,sectionId):
    blob =TextBlob(text)
    senti = blob.sentiment.polarity
    value = parseEntityValue(entity)
    print(value)
    db = getDbCta(intent,value,pageId,sectionId)
    
    if ( -0.5 < senti < 0.5):
        if (intent == "unreserved_table_person"):
            if db is not None:
                V = re.findall(r'\d+', value)
                number = "".join(V)
                context = db['context']
                iD = getEntityClickAttribute(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":number,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent} 
            else:
                tableResponse = searchingTable(value,senti,intent,text)
                return tableResponse
        elif (intent == "Order_meal"or intent == "product-detail" or intent == "remove_item" or intent == "edit_product" or intent == "reduce_product_quantity"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId,text)
            return Response
        elif (intent == "inform_date"):
            if db is not None:
                Response = parseDate(text,db,pageId,sectionId,intent,senti)
                return Response
            else:
                return {"Response":"Can't find the data in database","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
        elif (intent == "inform_time"):
            if db is not None:
                Response = parseTime(text,db,pageId,sectionId,intent,senti)
                return Response
            else:
                return {"Response":"Can't find the data in database","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
        elif (intent == "inform_name"):
            if db is not None:
                if (value is not None):
                    context = db['context']
                    iD = getEntityClickAttribute(context['entities'])
                    return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent}
                else:
                    return {"Response":"sorry,can you please tell me your name again?","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
            else:
                return {"Response":"Can't find the data in database","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
        else:
            if db is not None:
                context = db['context']
                iD = getEntityClickAttribute(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent} 
            else:
                return {"Response":"I’m sorry,Could you say it again?","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":'nlu_fallback'}

    elif(senti > 0.5):
        if(intent == "Order_meal"or intent == "product-detail" or intent == "remove_item" or intent == "edit_product" or intent == "reduce_product_quantity"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId,text)
            return Response
        elif(intent == "product_flavour"):
            if db is not None:
                context = db['context']
                iD = getEntityClickAttribute(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent} 
            else:
                return {"Response":"The data not available in database ","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":'nlu_fallback'}
        else:
            if db is not None:
                sentimentResponse = db['sentimentResponse']
                return {"Response":sentimentResponse['positive'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":text,"intentName":intent}
            else: 
                return {"Response":"I’m sorry,Could you say it again?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":'nlu_fallback'}

    elif(senti < -0.5):
        if(intent == "Order_meal"or intent == "product-detail" or intent == "remove_item" or intent == "edit_product" or intent == "reduce_product_quantity"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId,text)
            return Response
        elif(intent == "product_flavour"):
            if db is not None:
                context = db['context']
                iD = getEntityClickAttribute(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent} 
            else:
                return {"Response":"The data not available in database ","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":'nlu_fallback'}
        else:
            if db is not None:
                sentimentResponse = db['sentimentResponse']
                return {"Response":sentimentResponse['positive'],"ctaCommandId":db['ctaCommandId'],"sentimentScore":text,"intentName":intent}
            else: 
                return {"Response":"I’m sorry,Could you say it again?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":'nlu_fallback'}