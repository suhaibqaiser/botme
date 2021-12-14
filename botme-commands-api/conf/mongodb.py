from flask_pymongo import MongoClient
from config import MONGO_URL

def getDbCta(intent,entity,pageId,sectionId):
    mydb = MongoClient(MONGO_URL)
    db = mydb['food']
    mycollection = db['ctas']
    if (entity != None):
        if (intent == "unreserved_table_person" or intent == "inform_name" or intent == "inform_date" or intent == "inform_time"):
            my_query = {"intentName":intent,"context.pageId":pageId,"context.sectionId":sectionId}
            mycta = mycollection.find(my_query)
            for x in mycta:
                print(x)
                if (len(x) == 0):
                    return None
                else:
                    return x
        else:
            value = entity.title()
            my_query = {"intentName":intent,"context.entities.entityName":value,"context.pageId":pageId,"context.sectionId":sectionId}
            mycta = mycollection.find(my_query)
            for x in mycta:
                if(len(x) == 0):
                    return None
                else:
                    return x
    else:
        my_query = {"intentName":intent,"context.pageId":pageId,"context.sectionId":sectionId}
        mycta = mycollection.find(my_query)
        for x in mycta:
            if (len(x) == 0):
                return None
            else:
                return x

def findResponse(number):
    mydb = MongoClient(MONGO_URL)
    db = mydb['food']
    mycollection = db['Responses']
    myQuery = {"ResponseId":number} 
    Response = mycollection.find(myQuery).collation({"locale":"en"})
    if Response:
        print("Taha")
        print(Response)
        return Response['Response']
    else:
        return None