import imp
from attr import attributes
from flask import Response
from controller.utility import Utility
from Service.suggestionApi import getProductId


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
        print(suggestion)

        data = getProductId(suggestion, self.restaurantId)

        if data['status'] == "success":
            value = data['payload']
            value1 = Suggestion.getAllProductid(value['products'])
            value2 = Suggestion.getAllProductid(value['drinks'])
            value = value1 + value2

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
        productArray = []
        valueNumber = 0
        valueDrink = ""
        attributes= {"glutenFree":False,"halal":False,"vegan":False,"vegetarian":False}
        for x in self.entity:
            if x['entity'] == 'suggestion':
                valueProduct = x['value']
                valueProduct = valueProduct.lower()
                productArray.append(valueProduct)

            elif x['entity'] == "number":
                valueNumber = x['value']
                valueNumber = int(valueNumber)

            elif x['entity'] == "drink":
                valueDrink = x['value']
                valueDrink = valueDrink.lower()

            elif x['entity'] == "attribute":
                if x['value'] == "glutenFree":
                    attributes['glutenFree'] = True

                if x['value'] == "halal":
                    attributes['halal'] = True
                
                if x['value'] == "vegan":
                    attributes['vegan'] = True
                
                if x['value'] == "vegetarian":
                    attributes['vegetarian'] = True
            else:
                return {"product": [],"persons": "","drink": "","attributes": attributes}

        return {"product": productArray,"persons": valueNumber,"drink": valueDrink,"attributes": attributes}

    def getAllProductid(payload):
        arr = []
        for x in payload:
            arr.append(x)
        return arr
