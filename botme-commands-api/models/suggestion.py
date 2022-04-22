from flask import Response
from controller.utility import Utility
from Service.suggestionApi import getProductId
from Service.restaurantApi import getProductUsingProductId
import json

class Suggestion():
    def __init__(self, intent, entities, senti, pageId, sectionId, text, db, converstion, context, restaurantId):
        self.intent = intent
        self.entity = entities
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.form = None
        self.converstion = converstion
        self.context = context
        # self.searchParameter = searchParameter
        self.restaurantId = restaurantId
        self.call = None

    def suggestionResponse(self):
        suggestion = Suggestion.entityArray(self)
        self.call = suggestion['keywords']
        persons = suggestion['persons']

        data = getProductId(suggestion, self.restaurantId)

        if data['status'] == "success":
            value = data['payload']

            products = value['products']
            drinks = value['drinks']

            productId = products + drinks

            if len(productId) == 0:
                value = []
                utility = Utility(self.pageId, self.sectionId, value,
                                  self.text, self.intent, self.db, self.form, self.call)
                Response = utility.suggestionResponse()
                return Response
            else:
                value = Suggestion.getAllPackage(self,productId,persons)
                utility = Utility(self.pageId, self.sectionId, value,
                                  self.text, self.intent, self.db, self.form, self.call)
                Response = utility.suggestionResponse()
                return Response
        else:
            value = None
            utility = Utility(self.pageId, self.sectionId, value,
                              self.text, self.intent, self.db, self.form, self.call)
            Response = utility.nluFallBack()
            return Response

    def entityArray(self):
        suggestion = {"product": [],"persons": 1,"drink": "","attributes": {},"keywords": []}
        # attributes= {"glutenFree":False,"halal":False,"vegan":False,"vegetarian":False}
        for x in self.entity:
            if x['entity'] == 'suggestion':
                valueProduct = x['value']
                valueProduct = valueProduct.lower()
                suggestion['keywords'].append(valueProduct)
                suggestion['product'].append(valueProduct)
            else:
                productArray = []

            if x['entity'] == "number":
                valueNumber = x['value']
                suggestion['keywords'].append(valueNumber)
                suggestion['persons'] = int(valueNumber)
            else:
                valueNumber = 1

            if x['entity'] == "drink":
                valueDrink = x['value']
                valueDrink = valueDrink.lower()
                suggestion['keywords'].append(valueDrink)
                suggestion['drink'] = valueDrink
            else:
                valueDrink = ""

            if x['entity'] == "attribute":
                if x['value'] == "glutenFree":
                    suggestion['keywords'].append(x['value'])
                    suggestion['attributes']['glutenFree'] = True

                if x['value'] == "halal":
                    suggestion['keywords'].append(x['value'])
                    suggestion['attributes']['halal'] = True
                
                if x['value'] == "vegan":
                    suggestion['keywords'].append(x['value'])
                    suggestion['attributes']['vegan'] = True
                
                if x['value'] == "vegetarian":
                    suggestion['keywords'].append(x['value'])
                    suggestion['attributes']['vegetarian'] = True

        # suggestion = {"product": productArray,"persons": valueNumber,"drink": valueDrink,"attributes": attributes,"keywords": keyword}
        # return {"product": productArray,"persons": valueNumber,"drink": valueDrink,"attributes": attributes,"keywords": keyword}
        print("suggestion==>",suggestion)
        return suggestion

    def getAllPackage(self,productId,persons):
        package = []
        for Id in productId:
            obj = {"restaurantId":"","productId":"","productSerialNo":"","productCategory":"","productFlavor":"","productProportion":[],"productToppings":[],"productOptions":[],"productRate":{},"productQuantity":"","productIngredients":[],"productNotes":"","productTotalPrice":0,"cartDiscount":0,"cartTotal":0}
            data = getProductUsingProductId(Id,self.restaurantId)
            if data['status'] == "success":
                value =data['payload']
                result = Suggestion.handlingProductAttributes(value)
                print("Result==>",result)
                obj['restaurantId'] = self.restaurantId 
                obj['productId'] = Id
                obj['productFlavor'] = result['productFlavour']
                obj['productRate'] = result['productRate']
                obj['productQuantity'] = persons
                obj['productIngredients'] = result['productIngrident']
                totalPrice = persons * result['productPrice']
                obj['productTotalPrice'] = totalPrice
                package.append(obj)

        return package

    def handlingProductAttributes(product):
        if len(product) > 0:
            for prod in product:
                productIngrident = Suggestion.productIngredients(prod['productIngredients'])
                productFlavour = Suggestion.productFlavour(prod['productFlavor'])
                productRate = prod['productRate'] 
                productPrice = Suggestion.productPrice(prod['productRate'])
                Result = {"productIngrident":productIngrident,"productFlavour":productFlavour,"productPrice":productPrice,"productRate":{"standard":productRate['standard']}}
                return Result

    def productIngredients(Ingredients):
        obj = {"productId":"","productQuantity":0}
        array = []
        if Ingredients is not None:
            if len(Ingredients) > 0:
                for ingred in Ingredients:
                    print("Ingredients",ingred)
                    obj['productId'] = ingred
                    print(obj)
                    array.append(obj)
                return array
            else:
                return array
        else:
            return array

    def productFlavour(Flavor):
        productFlavor = ""
        if Flavor is not None:
            if len(Flavor) > 0:
                for Flav in Flavor:
                    print(Flav)
                    productFlavor = Flav
                    print(productFlavor)
                    return productFlavor
            else:
                return productFlavor
        else:
            return productFlavor
    
    def productPrice(Rate):
        if Rate['standard']:
            price = Rate['standard']
            return price