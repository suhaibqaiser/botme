from conf.mongodb import getDbCta
import requests

class Entity():
    def __init__(self, entity, intent):  
        self.entity = entity 
        self.intent = intent

    def parseEntityValue(self):
        for x in self.entity:
            if(len(self.entity) == 1):
                return x['value']
            elif(len(self.entity)>1):
                if self.intent == "place_order_page":
                    find = "pagesix"
                    value = Entity.findRightEntity(find,self.entity)
                    return value
                elif self.intent == "book_now":
                    find = "reserved"
                    value = Entity.findRightEntity(find,self.entity)
                    return value
                else:
                    value = Entity.joinTwoEntity(self.entity)
                    return value
            elif(len(self.entity)==0):
                return None

    def joinTwoEntity(entity):
        array = []
        for x in entity:
            array.append(x['value'])
        value = " ".join(array)
        return value

    def findRightEntity(find,entity):
        for x in entity:
            if x['entity'] == find:
                value = x['value']
                return value
        return None                