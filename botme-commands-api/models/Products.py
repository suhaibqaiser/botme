from pymongo import response
from requests.models import Response
from conf.mongodb import getDbCta, insertingWrongResponseInDb
from controller.utility import Utility
from config import RESTAURANT_API
from Service.restaurantApi import getProductUsingProductName , getProductUsingProductId


class Product():
    def __init__(self,intent,value,senti,pageId,sectionId,text,db,parentEntity,converstion,context):
          
        self.intent = intent
        self.value = value
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.parentEntity = parentEntity
        self.form = None
        self.converstion = converstion
        self.context = context

    # PRODUCT RESPONSE IF NO PARENT ENTITY
    def ProductResponseIfNoParentEntity(self):
        try:
            self.data = getProductUsingProductName(self.value,self.context['restaurantId'])
            self.payload = self.data['payload']
            if(self.data['status'] == "success"):
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
            # wrongCommand = insertingWrongResponseInDb(self.converstion['conversationId'],self.converstion['conversationLogId'],self.context['clientId'],self.context['sessionId'],Response,self.text)
            return Response


    def ifProductArrayIsOne(self):
        if(self.value.title() == self.text.title()):
            call = None
            utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
            Response = utility.nluFallBack()
            # wrongCommand = insertingWrongResponseInDb(self.converstion['conversationId'],self.converstion['conversationLogId'],self.context['clientId'],self.context['sessionId'],Response,self.text)
            return Response
        else:
            db = getDbCta(self.intent,self.value,self.pageId,self.sectionId)
            if(db != None):
                productID = Product.parseProductId(self.payload)
                call = productID
                self.form = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                Response = utility.getProductResponse()
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
  
    def getAllProducts(payload):
        array = []
        for x in payload:
            array.append(x['productName'])
        product =",".join(array)
        return product
    
    # PRODUCT RESPONSE IF PARENTENTITY
    def productResponseIfParentEntity(self):
        try:
            print("2")
            parentProductId = self.parentEntity['entityId']
            data = getProductUsingProductName(self.value,self.context['restaurantId'])
            print("1 ==>",data)
            payload = data['payload']
            print(parentProductId)
            parentdata = getProductUsingProductId(parentProductId,self.context['restaurantId'])
            parentPayload = parentdata['payload']
            print("3 ==>",parentPayload)
            if parentdata['status'] == "success":
                id = Product.checkForIntent(self.intent,self.value,payload)
                print(id)
                Result = Product.ValidationForProduct(parentPayload,self.sectionId,self.intent,self.value,id)
                print(Result)
                if Result:
                    call = id
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
            # wrongCommand = insertingWrongResponseInDb(self.converstion['conversationId'],self.converstion['conversationLogId'],self.converstion['clientId'],self.converstion['sessionId'],Response,self.text)
            return Response


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
                if intent == "Order_meal" or intent == "reduce_product_quantity" or intent == "add_product_to_cart":
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
    
    def checkForIntent(intent,value,payload):
        if intent == "product_flavour":
            iD = value.title()
            return iD
        else:
            iD = Product.parseProductId(payload)
            return iD

