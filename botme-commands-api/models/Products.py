from conf.mongodb import findResponse, getDbCta
import requests

from config import RESTAURANT_API


class Product():
    def __init__(self,intent,value,senti,pageId,sectionId,text):
          
        self.intent = intent
        self.value = value
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text

    def checkingForProduct(self):
        try:
            response = requests.get(RESTAURANT_API + '/food/product/search?productName='+self.value)
            data = response.json()
            payload = data['payload']
            if(data['status']=="success"):
                if(len(data['payload']) == 1):
                    db = getDbCta(self.intent,self.value,self.pageId,self.sectionId)
                    if(db != None):
                        context = db['context']
                        productID = Product.parseProductId(payload)
                        iD = Product.getEntityClickAttribute(context['entities'])
                        if(self.sectionId == "sectionId-cart-modal"):
                            name = self.value.title()
                            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":productID+name,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                        else:
                            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":productID,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                    else:
                        if self.pageId == "pageId-order-online":
                            if(data['payload']):
                                product = data['payload'][0]['productName']
                                return {"Response":"Do you mean "+product,"ctaCommandId":"ctaId-search","pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":"entityId-search","actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
                            else:
                                number = "6"
                                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""} 
                        else:
                            number = "7"
                            return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""} 
                else:
                    products = Product.getAllProducts(data['payload'])
                    print(products)
                    return {"Response":"Found this product "+ products +" for name "+self.value+" .Which one you want to order?","ctaCommandId":"ctaId-search","pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":"entityId-search","actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
            else:
                number = "8"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":""}
        except:
            return "error in checking for product"

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


 
