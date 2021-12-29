from requests.models import Response
from conf.mongodb import findResponse, getDbCta
import requests
from controller.utility import Utility
from config import RESTAURANT_API


class Product():
    def __init__(self,intent,value,senti,pageId,sectionId,text,db):
          
        self.intent = intent
        self.value = value
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db

    def checkingForProduct(self):
        try:
            response = requests.get(RESTAURANT_API + '/food/product/search?productName='+self.value)
            self.data = response.json()
            self.payload = self.data['payload']
            if(self.data['status'] == "success"):
                if(len(self.data['payload']) == 1):
                    Response = Product.ifProductArrayIsOne(self)
                    return Response
                    # if(self.value.title() == self.text.title()):
                    #     Response = {"Response":"please specify the command for "+self.value,"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                    #     return Response
                    # else:
                    #     db = getDbCta(self.intent,self.value,self.pageId,self.sectionId)
                    #     if(db != None):
                    #         context = db['context']
                    #         productID = Product.parseProductId(self.payload)
                    #         iD = Product.getEntityClickAttribute(context['entities'])
                    #         if(self.sectionId == "sectionId-cart-modal"):
                    #             name = self.value.title()
                    #             return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":productID+name,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                    #         else:
                    #             return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":productID,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                    #     else:
                    #         if(self.data['payload']):
                    #             product = self.data['payload'][0]['productName']
                    #             return {"Response":"Do you mean "+product,"ctaCommandId":"ctaId-search","pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":"entityId-search","actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                    #         else:
                    #             number = "6"
                    #             return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""} 
                else:
                    self.db = None
                    self.form = None
                    call = Product.getAllProducts(self.data['payload'])
                    utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                    Response = utility.ifMoreThanOneProduct()
                    # return {"Response":"Found this product "+ products +" for name "+self.value+" .Which one you want to order?","ctaCommandId":"ctaId-search","pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":"entityId-search","actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                    return Response
            else:
                call = None
                self.form = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                Response = utility.ifNoProductFound()
                return Response
                # number = "8"
                # return {"Response":findResponse(number),"ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
        except:
            call = None
            self.db = None
            self.form = None
            utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
            Response = utility.nluFallBack()


    def ifProductArrayIsOne(self):
        if(self.value.title() == self.text.title()):
            call = None
            utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
            Response = utility.nluFallBack()
            # response = {"Response":"please specify the command for "+self.value,"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
            return Response
        else:
            db = getDbCta(self.intent,self.value,self.pageId,self.sectionId)
            if(db != None):
                productID = Product.parseProductId(self.payload)
                call = productID
                self.form = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                Response = utility.ifSectionIdCartModel()
                return Response
                # if(self.sectionId == "sectionId-cart-modal"):
                #     name = self.value.title()
                #     return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":productID+name,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                # else:
                #     return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":productID,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":""}
            else:
                call = self.data['payload']
                self.form = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                Response = utility.ifProductNotFoundInDb()
                return Response

                # if(self.data['payload']):
                #     product = self.data['payload'][0]['productName']
                #     return {"Response":"Do you mean "+product,"ctaCommandId":"ctaId-search","pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":"entityId-search","actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                # else:
                #     number = "6"
                #     return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}

    def parseProductId(payload):
        for x in payload:
            return x['productId']

    def getEntityClickAttribute(entity):
        for x in entity:
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}
    
    def getAllProducts(payload):
        array = []
        for x in payload:
            array.append(x['productName'])
        product =",".join(array)
        return product
 
