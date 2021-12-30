from pymongo import response
from requests.models import Response
from conf.mongodb import findResponse, getDbCta
import requests
from controller.utility import Utility
from config import RESTAURANT_API


class Product():
    def __init__(self,intent,value,senti,pageId,sectionId,text,db,parentEntity):
          
        self.intent = intent
        self.value = value
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.parentEntity = parentEntity

    def checkingForProduct(self):
        try:
            if self.intent == "product_flavour":
                response = Product.ValidationProductCode(self)
                return response
            else:    
                response = requests.get(RESTAURANT_API + '/food/product/search?productName='+self.value)
                self.data = response.json()
                self.payload = self.data['payload']
                if(self.data['status'] == "success"):
                    if self.pageId == "pageId-order-online" or self.pageId == "pageId-home" or self.pageId == "pageId-product-detial-page" or self.pageId == "pageId-cart" or self.pageId == "pageId-cart-modal":
                        if(len(self.data['payload']) == 1):
                            Response = Product.ifProductArrayIsOne(self)
                            return Response 
                        else:
                            self.db = None
                            self.form = None
                            call = Product.getAllProducts(self.data['payload'])
                            utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                            Response = utility.ifMoreThanOneProduct()
                            return Response
                    elif(self.pageId == "pageId-product-customize-modal"):
                        response = Product.ValidationProductCode(self)
                        return response
                else:
                    call = None
                    self.form = None
                    utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                    Response = utility.ifNoProductFound()
                    return Response
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
            else:
                call = self.data['payload']
                self.form = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                Response = utility.ifProductNotFoundInDb()
                return Response

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
    
    def ValidationProductCode(self):
        try:
            self.form = None
            parentProductName = self.parentEntity['entityValue']
            parentResponse = requests.get(RESTAURANT_API + '/food/product/search?productName='+parentProductName)
            parentdata = parentResponse.json()
            parentPayload = parentdata['payload']
            print(parentPayload)
            if parentdata['status'] == "success":
                if self.intent == "product_flavour":
                    iD = self.value.title()
                    Result = Product.ValidationForProduct(parentPayload,self.sectionId,self.intent,self.value,iD)
                    print(Result)
                    if Result:
                        call = None
                        utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                        Response = utility.validationProductResponse()
                        return Response
                    else:
                        call = None
                        self.form = None
                        utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                        Response = utility.ifValidationForProductFalse()
                        return Response
                else:
                    iD = Product.parseProductId(self.payload)
                    Result = Product.ValidationForProduct(parentPayload,self.sectionId,self.intent,self.value,iD)
                    print(Result)
                    if Result:
                        call = iD
                        utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                        Response = utility.validationProductResponse()
                        return Response
                    else:
                        call = None
                        self.form = None
                        utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                        Response = utility.ifValidationForProductFalse()
                        return Response
        except:
            call = None
            self.db = None
            self.form = None
            utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
            Response = utility.nluFallBack()

    def ValidationForProduct(payload,sectionId,intent,value,iD):
        for x in payload:
            if sectionId == "sectionId-servingSize-productOptions":
                if intent == "food_size":
                    if x['productRate'] == value:
                        return True
                    else:
                        return False
                elif intent == "Order_meal" or intent == "remove_item":
                    if Product.checkingForProductOptions(x['productOptions'],iD):
                        return True
                    else:
                        return False

            elif sectionId == "sectionId-ingredients-flavour":
                if intent == "Order_meal" or intent == "remove_item":
                    if iD in x['productIngredients']:
                        return True
                    else:
                        return False
                elif intent == "product_flavour":
                    if iD in x['productFlavor']:
                        return True
                    else:
                        return False

            elif sectionId == "sectionId-toppings":
                if intent == "Order_meal" or intent == "reduce_product_quantity":
                    if iD in x['productToppings']:
                        return True
                    else:
                        return False
            
            elif sectionId == "sectionId-addons":
                return True
            else:
                return False

    def checkingForProductOptions(productOptions,iD):
        for x in productOptions:
            if iD in x:
                return True
        return False
