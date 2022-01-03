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
                return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
            else:
                context = self.db['context']
                iD = Utility.getEntityClickAttribute(context['entities'])
                return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
        else:
            number = "1"
            return {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "","entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}

    # RESPONSE WHEN NO INTENT DETECTED FROM RASA

    def nluFallBack(self):
        number = "1"
        response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "","entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
        return response

    # RESERVATION RESPONSES

    def reservationResponse(self):
        if self.db:
            context = self.db['context']
            self.pageId = context['pageId']
            self.sectionId = context['sectionId']
            iD = Utility.getEntityClickAttribute(context['entities'])
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
            return response
        else:
            number = "1"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "","entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
            return response
    
    def nameResponse(self):
        if self.db:
            Response = self.call.name()
            return Response
        else:   
            number = "2"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
            return response

    def incorrectName(self):
        number = "5"
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
        return response

    def personResponse(self):
        if self.db:
            Response = self.call.reservation()
            return Response
        else:
            number = "2"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
            return response

    def incorrectPersonResponse(self):
        number = "9"
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
        return response

    def dateResponse(self):
        if self.db is not None:
            Response = self.call.parseDate()
            return Response
        else:
            number = "2"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
            return response

    def incorrectDate(self):
        number = "3"
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
        return response

    def timeResponse(self):
        if self.db is not None:
            Response = self.call.parseTime()
            return Response
        else:
            number = "2"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
            return response

    def incorrectTime(self):
        number = "3"
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
        return response
                    
    def findNextFieldFocus(self):
        context = self.db['context']
        iD = Utility.getEntityClickAttribute(context['entities'])
        for x in self.form:
            if not x['entityValue']:
                x['entitySelected'] = True
                return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
        return {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
    
    def nameField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "12"
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}

                return response
            else:
                number = "12"
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
                return response
        else:
            number = "12"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
            return response
        
    def personField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "13"
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
                return response
            else:
                number = "13"
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
                return response
        else:
            number = "13"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
            return response
        
    def dateField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "14"
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
                return response
            else:
                number = "14"
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
                return response
        else:
            number = "14"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context":{"pageId":self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities":self.form}}
            return response

    def timeField(self):
        if self.db:
            context = self.db['context']
            iD = Utility.getEntityClickAttribute(context['entities'])
            if self.intent == "book_now":
                number = "15"
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
                return response
            else:
                number = "15"
                response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
                return response
        else:
            number = "15"
            response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : self.form}}
            return response
        
    def bookNowResponse(self):
        context = self.db['context']
        iD = Utility.getEntityClickAttribute(context['entities'])
        response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"clickAttribute" : "href, button","keywords" :""}]}}
        return response

    # PRODUCT RESPONSES

    def ifMoreThanOneProduct(self):
        Response = {"ctaId":"ctaId-search","inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":"Found this product "+ self.call +" for name "+self.value+" .Which one you want to order?"},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "entityId-search","entityValue" : self.value,"entitySelected":"","clickAttribute" : "href, button","keywords" :""}]}}
        return Response

    def ifNoProductFound(self):
        number = "8"
        Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response
        
    def ifProductNameAndTextEqual(self):
        Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":"please specify the command for "+self.value},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response

    def getProductResponse(self):
        Response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":self.value},"entities" : [{"entityId" : self.call,"entityValue" : self.value,"entitySelected":True,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response

    def ifProductNotFoundInDb(self):
        if(self.call):
            product = self.call[0]['productName']
            Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":"Do you mean "+product},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
            return Response
        else:
            number = "6"
            Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "","entityValue" : "","entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
            return Response
                
    def ifNotProductPage(self):
        number = "7"
        Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":findResponse(number)},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : "","entityValue" : self.value,"entitySelected":False,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response

    def validationProductResponse(self):
        if self.db:
            if self.intent == "product_flavour":
                context = self.db['context']
                iD = Utility.getEntityClickAttribute(context['entities'])
                Response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : iD['entityId'],"entityValue" : self.value,"entitySelected":None,"clickAttribute" : "href, button","keywords" :""}]}}
                return Response            
            else:
                Response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":self.db['response']},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : self.call,"entityValue" : self.value,"entitySelected":None,"clickAttribute" : "href, button","keywords" :""}]}}
                return Response
        else:
            Response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":"can not find the data in database"},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : None,"entityValue" : self.value,"entitySelected":None,"clickAttribute" : "href, button","keywords" :""}]}}

    def ifValidationForProductFalse(self):
        Response = {"ctaId":None,"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":"There is no such item here for me to perform action"},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : None,"entityValue" : self.value,"entitySelected":None,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response
    
    def ifParentEntityValueWrong(self):
        Response = {"ctaId":self.db['ctaCommandId'],"inputText":{"textValue":self.text,"language":"english","timestamp":self.now},"outputText":{"textValue":"Parent entity value is wrong"},"context" : {"pageId" : self.pageId,"sectionId":self.sectionId,"parentEntity":{"entityId":"","entityValue":""},"entities" : [{"entityId" : None,"entityValue" : self.value,"entitySelected":None,"clickAttribute" : "href, button","keywords" :""}]}}
        return Response


    # GETTING ENTITYID AND CLICK ATTRIBUTE

    def getEntityClickAttribute(entity):
        for x in entity:
            print("Result ==>",x)
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}