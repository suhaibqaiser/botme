from conf.mongodb import getDbCta
from textblob import TextBlob
from controller.functions import parseEntityValue,checkingForProduct,searchingTable,getEntityClickAttribute



def getResponse(intent,entity,text,pageId,sectionId):
    blob =TextBlob(text)
    senti = blob.sentiment.polarity
    print(senti)
    value = parseEntityValue(entity)
    print(value)
    
    if ( -0.5 < senti < 0.5):
        if (intent == "unreserved_table_person"):
            db = getDbCta(intent,value,pageId,sectionId)
            print(db)
            if db is not None:
                context = db['context']
                iD = getEntityClickAttribute(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":senti,"intentName":intent} 
            else:
                tableResponse = searchingTable(value,senti,intent)
                return tableResponse

        elif (intent == "unexpected_answer"):
            return {"Response":"I need to know how many people are in your party to ensure that we can accomodate you.","ctaCommandId":None,"pageId":None,"sectionId":value,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        elif (intent == "Order_meal"or intent == "product-detail" or intent == "product-detail" or intent == "remove_item"):
            Response = checkingForProduct(intent,value,senti,pageId,sectionId)
            return Response
        elif (intent == 'thanks'):
            return {"Response":"your welcome","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        elif (intent == 'nlu_fallback'):
            return {"Response":"I'm sorry, I didn't quite understand that. Could you rephrase?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        elif (intent == 'out_of_scope'):
            return {"Response":"Sorry, I can't handle that request","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":senti,"intentName":intent}
        else:
            db = getDbCta(intent,value,pageId,sectionId)
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