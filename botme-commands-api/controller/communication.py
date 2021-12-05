from conf.mongodb import getDbCta
from textblob import TextBlob
from models.Entity import Entity
from models.DateTime import DateTime
from models.Products import Product
from models.Reservation import Reservation

# reminder need to change text to senti in responses

def getResponse(intent,entity,text,pageId,sectionId,form):
    print(form)
    blob =TextBlob(text)
    senti = blob.sentiment.polarity
    val = Entity(entity)
    value = val.parseEntityValue()
    db = getDbCta(intent,value,pageId,sectionId)
    datetime = DateTime(intent,value,senti,pageId,sectionId,text,db,form)
    product = Product(intent,value,senti,pageId,sectionId,text)
    reservation = Reservation(intent,value,senti,pageId,sectionId,text,db,form)

    if (intent == "Order_meal"or intent == "product-detail" or intent == "remove_item" or intent == "edit_product" or intent == "reduce_product_quantity"):
        Response = product.checkingForProduct()
        return Response
    
    elif (intent == "reservation_page"):
        if db is not None:
            form[0]['entityStatus'] = True
            context = db['context']
            iD = getEntityClickAttribute(context['entities'])
            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form} 
        else:
            return {"Response":"I’m sorry,Could you say it again?","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":'nlu_fallback',"entities":form}

    elif (intent == "inform_name"):
        if db is not None:
            if (value is not None):
                form[0]['entityValue'] = value
                form[0]['entityStatus'] = False
                form[1]['entityStatus'] = True
                print(form)
                context = db['context']
                iD = getEntityClickAttribute(context['entities'])
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
            else:
                return {"Response":"sorry,can you please tell me your name again?","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":form}
        else:
            return {"Response":"Can't find the data in database","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":form}

    elif (intent == "unreserved_table_person"):
        Response = reservation.reservation()
        return Response

    elif (intent == "inform_date"):
        if db is not None:
            Response = datetime.parseDate()
            return Response
        else:
            return {"Response":"Can't find the data in database","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":""}

    elif (intent == "inform_time"):
        if db is not None:
            Response = datetime.parseTime()
            return Response
        else:
            return {"Response":"Can't find the data in database","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":""}

    else:
        if db is not None:
            context = db['context']
            iD = getEntityClickAttribute(context['entities'])
            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":""} 
        else:
            return {"Response":"I’m sorry,Could you say it again?","ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":'nlu_fallback',"entities":""}

def getEntityClickAttribute(entity):
        for x in entity:
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}
