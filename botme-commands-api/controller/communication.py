from conf.mongodb import getDbCta,findResponse
from textblob import TextBlob
from controller.utility import Utility
from models.Entity import Entity
from models.Name import Name
from models.Products import Product
from models.Reservation import Reservation
from models.DateTime import DateTime
from controller.reservationField import reservationField

# reminder need to change text to senti in responses

def getResponse(intent,entity,text,pageId,sectionId,form):
    blob =TextBlob(text)
    senti = blob.sentiment.polarity
    val = Entity(entity,intent)
    value = val.parseEntityValue()
    db = getDbCta(intent,value,pageId,sectionId)

    if (intent == "Order_meal"or intent == "product-detail" or intent == "remove_item" or intent == "edit_product" or intent == "reduce_product_quantity"):
        if pageId == "pageId-order-online" or pageId == "pageId-product-customize-modal" or pageId == "pageId-product-detial-page" or pageId == "pageId-home" or pageId == "pageId-cart" or pageId == "pageId-cart-modal":
            product = Product(intent,value,senti,pageId,sectionId,text)
            Response = product.checkingForProduct()
            return Response
        else:
            number = "7"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":""} 

    elif (intent == "reservation_page"):
        form = reservationField(db,form,pageId,sectionId,value,text,intent)
        call = None
        utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
        response = utility.reservationResponse()
        return response
    
    elif (intent == "inform_name"):
        name = Name(intent,value,pageId,sectionId,text,db,form)
        utility = Utility(pageId,sectionId,value,text,intent,db,form,name)
        response = utility.nameResponse()
        return response

    elif (intent == "unreserved_table_person"):
       reservation = Reservation(intent,value,pageId,sectionId,text,db,form)
       utility = Utility(pageId,sectionId,value,text,intent,db,form,reservation)
       Response = utility.personResponse()
       return Response

    elif (intent == "inform_date"):
        date = DateTime(intent,value,pageId,sectionId,text,db,form)
        utility = Utility(pageId,sectionId,value,text,intent,db,form,date)
        response = utility.dateResponse()
        return response

    elif (intent == "inform_time"):
        time = DateTime(intent,value,pageId,sectionId,text,db,form)
        utility = Utility(pageId,sectionId,value,text,intent,db,form,time)
        response = utility.timeResponse()
        return response
        
    elif (intent == "book_now"):
        Response = reservationField(db,form,pageId,sectionId,value,text,intent)
        return Response 

    else:
        call = None
        utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
        response = utility.dbResponse()
        return response


