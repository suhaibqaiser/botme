from requests.models import Response
from conf.mongodb import findResponse


class Utility:
    def __init__(self,pageId,sectionId,value,text,intent,db,form,call):
        
        self.pageId = pageId
        self.sectionId = sectionId
        self.value = value
        self.text = text
        self.intent = intent
        self.db = db
        self.form = form
        self.call = call
    
    def dbResponse(self):
        if self.db is not None:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            return {"Response":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":""} 
        else:
            number = "1"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":'nlu_fallback',"entities":""}

    def nluFallBack(self):
        number = "1"
        response = {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
        return response
    
    def reservationResponse(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            response = {"Response":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            return response
        else:
            number = "1"
            response = {"Response": findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":'nlu_fallback',"entities":self.form}
            return response
    
    def nameResponse(self):
        # name = Name(self.intent,self.value,self.pageId,self.sectionId,self.text,self.db,self.form)
        if self.db:
            Response = self.call.name()
            return Response
        else:   
            number = "2"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}

    def incorrectName(self):
        number = "5"
        Response = {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        return Response

    def personResponse(self):
        # reservation = Reservation(self.intent,self.value,self.senti,self.pageId,self.sectionId,self.text,self.db,self.form)
        if self.db:
            Response = self.call.reservation()
            return Response
        else:
            number = "2"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
    
    def incorrectPersonResponse(self):
        number = "9"
        Response = {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        return Response

    def dateResponse(self):
        # datetime = DateTime(self.intent,self.value,self.pageId,self.sectionId,self.text,self.db,self.form)
        if self.db is not None:
            Response = self.call.parseDate()
            return Response
        else:
            number = "2"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}

    def incorrectDate(self):
        number = "3"
        Response = {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        return Response

    def timeResponse(self):
        # datetime = DateTime(self.intent,self.value,self.pageId,self.sectionId,self.text,self.db,self.form)
        if self.db is not None:
            Response = self.call.parseTime()
            return Response
        else:
            number = "2"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}

    def incorrectTime(self):
        number = "3"
        Response = {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form} 
        return Response
                    

    def findNextFieldFocus(self):
        context = self.db['context']
        iD = Utility.getEntityClickAttribute(context['entities'])
        for x in self.form:
            if not x['entityValue']:
                x['entityStatus'] = True
                return {"Response":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        return {"Response":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
    
    def nameField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "12"
                return {"Response":findResponse(number),"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            else:
                number = "12"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        else:
            number = "12"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        
    def personField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "13"
                return {"Response":findResponse(number),"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            else:
                number = "13"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        else:
            number = "13"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        
    def dateField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "14"
                return {"Response":findResponse(number),"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            else:
                number = "14"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        else:
            number = "14"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}

    def timeField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "15"
                return {"Response":findResponse(number),"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            else:
                number = "15"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        else:
            number = "15"
            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        
    def bookNowResponse(self):
        context = self.db['context']
        iD = Utility.getEntityClickAttribute(context['entities'])
        response = {"Response":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        return response

    def getEntityClickAttribute(entity):
        for x in entity:
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}