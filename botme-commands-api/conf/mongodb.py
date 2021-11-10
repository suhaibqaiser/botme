from flask_pymongo import MongoClient
from config import MONGO_URL

def getDbCta(intent,entity,pageId,sectionId):

    mydb = MongoClient(MONGO_URL)
    # print(mydb.list_database_names())
    db = mydb['food']
    mycollection = db['ctas']
    if (entity == None):
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
