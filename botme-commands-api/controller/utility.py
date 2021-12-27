from pymongo import response
from requests.models import Response
from conf.mongodb import findResponse
from datetime import datetime


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
        self.now = datetime.now()
    
    # RESPONSES FROM DATABASE

    def dbResponse(self):
        if self.db is not None:
            if (self.intent == "Home_page" or self.intent == "reservation_page" or self.intent == "contactus_page" or self.intent == "see_cart" or self.intent == "place_order_page"):
                context = self.db['context']
                self.pageId = context['pageId']
                self.sectionId = context['sectionId']
                iD = Utility.getEntityClickAttribute(context['entities'])
                return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
            else:
                context = self.db['context']
                iD = Utility.getEntityClickAttribute(context['entities'])
                return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
            # return {"":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent} 
        else:
            number = "1"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":'nlu_fallback'}
            return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}

    # RESPONSE WHEN NO INTENT DETECTED FROM RASA

    def nluFallBack(self):
        number = "1"
        # response = {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":None,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent}
        response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
        return response

    # RESERVATION RESPONSES

    def reservationResponse(self):
        if self.db:
            context = self.db['context']
            self.pageId = context['pageId']
            self.sectionId = context['sectionId']
            iD = Utility.getEntityClickAttribute(context['entities'])
            # response = {"":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            # return response
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
            return response
        else:
            number = "1"
            # response = {"": findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":'nlu_fallback',"entities":self.form}
            # return response
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
            return response
    
    def nameResponse(self):
        # name = Name(self.intent,self.value,self.pageId,self.sectionId,self.text,self.db,self.form)
        if self.db:
            Response = self.call.name()
            return Response
        else:   
            number = "2"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
            return response

    def incorrectName(self):
        number = "5"
        # Response = {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        # return Response
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
        return response

    def personResponse(self):
        # reservation = Reservation(self.intent,self.value,self.senti,self.pageId,self.sectionId,self.text,self.db,self.form)
        if self.db:
            Response = self.call.reservation()
            return Response
        else:
            number = "2"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
            return response

    def incorrectPersonResponse(self):
        number = "9"
        # Response = {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        # return Response
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
        return response

    def dateResponse(self):
        # datetime = DateTime(self.intent,self.value,self.pageId,self.sectionId,self.text,self.db,self.form)
        if self.db is not None:
            Response = self.call.parseDate()
            return Response
        else:
            number = "2"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent}
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
            return response

    def incorrectDate(self):
        number = "3"
        # Response = {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        # return Response
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
        return response

    def timeResponse(self):
        # datetime = DateTime(self.intent,self.value,self.pageId,self.sectionId,self.text,self.db,self.form)
        if self.db is not None:
            Response = self.call.parseTime()
            return Response
        else:
            number = "2"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent}
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
            return response

    def incorrectTime(self):
        number = "3"
        # Response = {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form} 
        # return Response
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
        return response
                    
    def findNextFieldFocus(self):
        context = self.db['context']
        iD = Utility.getEntityClickAttribute(context['entities'])
        for x in self.form:
            if not x['entityValue']:
                x['entityStatus'] = True
                # return {"":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
        # return {"":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
    
    def nameField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "12"
                # return {"":findResponse(number),"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                # response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}

                return response
            else:
                number = "12"
                # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
                return response
        else:
            number = "12"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
            return response
        
    def personField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "13"
                # return {"":findResponse(number),"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
                return response
            else:
                number = "13"
                # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
                return response
        else:
            number = "13"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
            return response
        
    def dateField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "14"
                # return {"":findResponse(number),"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
                return response
            else:
                number = "14"
                # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
                return response
        else:
            number = "14"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context":{"pageId":self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities":self.form}}
            return response

    def timeField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "15"
                # return {"":findResponse(number),"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
                return response
            else:
                number = "15"
                # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
                return response
        else:
            number = "15"
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : self.form}}
            return response
        
    def bookNowResponse(self):
        context = self.db['context']
        iD = Utility.getEntityClickAttribute(context['entities'])
        # response = {"":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        # return response
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
        return response

    # PRODUCT RESPONSES

    def ifMoreThanOneProduct(self):
        Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":"Found this product "+ self.call +" for name "+self.value+" .Which one you want to order?"},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response
        # return {"":"Found this product "+ self.call +" for name "+self.value+" .Which one you want to order?","ctaCommandId":"ctaId-search","pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":"entityId-search","actionType":None,"sentimentScore":self.text,"intentName":self.intent}

    def ifNoProductFound(self):
        number = "8"
        Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response
        # return {"":findResponse(number),"ctaCommandId":None,"pageId":None,"sectionId":None,"entityValue":None,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent}
        
    def ifProductNameAndTextEqual(self):
        # Response = {"":"please specify the command for "+self.value,"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent}
        # return Response
        Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":"please specify the command for "+self.value},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response

    def ifSectionIdCartModel(self):
        context = self.db['context']
        iD = Utility.getEntityClickAttribute(context['entities'])
        if self.sectionId == "sectionId-cart-modal":
            name = self.value.title()
            Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"entitySelected":True,"clickAttribute" : "href, button","keywords" :""}]}}
            return Response
            # return {"":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":self.call+name,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent}
        else:
            Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"entitySelected":True,"clickAttribute" : "href, button","keywords" :""}]}}
            return Response
            # return {"":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":self.call,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent}

    def ifProductNotFoundInDb(self):
        if(self.call):
            product = self.call[0]['productName']
            Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":"Do you mean "+product},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
            return Response
            # return {"":"Do you mean "+product,"ctaCommandId":"ctaId-search","pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":"entityId-search","actionType":None,"sentimentScore":self.text,"intentName":self.intent}
        else:
            number = "6"
            Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
            return Response
            # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent}
                
    def ifNotProductPage(self):
        number = "7"
        Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"id":"","name":""},"entities" : [{"entityId" : "","entityValue" : self.value,"entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response
        # return {"":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityValue":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent} 


    # GETTING ENTITYID AND CLICK ATTRIBUTE

    def getEntityClickAttribute(entity):
        for x in entity:
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}