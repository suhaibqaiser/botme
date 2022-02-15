import imp
from flask import Response
from controller.utility import Utility
from Service.suggestionApi import getProductId


class Suggestion():
    def __init__(self,intent,entities,senti,pageId,sectionId,text,db,converstion,context): 
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
        self.call = None
    
    def suggestionResponse(self):
        suggestion = Suggestion.entityArray(self.entity)
        print("suggestion ==>",suggestion)
        data = getProductId(suggestion['entity'],suggestion['number'])
        print("result ==>",data)
        if data['status'] == "success":
            value = Suggestion.parseProductid(data['payload'])
            utility = Utility(self.pageId,self.sectionId,value,self.text,self.intent,self.db,self.form,self.call)
            Response = utility.suggestionResponse()
            return Response
        else:
            value = None
            utility = Utility(self.pageId,self.sectionId,value,self.text,self.intent,self.db,self.form,self.call)
            Response = utility.nluFallBack()
            return Response

    def entityArray(entity):
        arrEntity = [] 
        for x in entity:
            if x['entity'] == 'productName':
                value = x['value']
                value = value.title()
                arrEntity.append(value)
            elif x['entity'] == "number":
                number = int(x['value'])
    
        return {"entity":arrEntity,"number":number}

    def parseProductid(payload):
        arr = []
        for x in payload:
            value = x['productId']
            arr.append(value)
        return arr

    