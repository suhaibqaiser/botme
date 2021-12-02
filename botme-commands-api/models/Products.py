from conf.mongodb import getDbCta
import requests


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
            response = requests.get('http://localhost:3100/food/product/search?productName='+self.value)
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
                            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":productID+name,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent}
                        else:
                            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":productID,"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent}
                    else:
                        return {"Response":"Product not found in database","ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent} 
                else:
                    return {"Response":"What do you mean by " + self.value + "?","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":'question'}
            else:
                return {"Response":"Product not available","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent}
        except:
            return "error in checking for product"

    def parseProductId(payload):
        for x in payload:
            return x['productId']

    def getEntityClickAttribute(entity):
        for x in entity:
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}
 
