from conf.mongodb import getDbCta
import requests

class Entity():
    def __init__(self, entity):  
        self.entity = entity 

    def parseEntityValue(self):
        for x in self.entity:
            if(len(self.entity) == 1):
                return x['value']
            elif(len(self.entity)>1):
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
