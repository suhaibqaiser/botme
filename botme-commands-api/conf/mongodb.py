from flask_pymongo import MongoClient
from config import MONGO_URL

def getDbCta(intent, entity):

    mydb = MongoClient(MONGO_URL)
    # print(mydb.list_database_names())
    db = mydb['food']
    mycollection = db['ctas']
    if not entity:
        my_query = {"intentName":intent}
        mycta = mycollection.find(my_query)
        for x in mycta:
            return x
    else:
        value = entity.title()
        my_query = {"intentName":intent,"context.entities.entityName":value}
        mycta = mycollection.find(my_query)
        for x in mycta:
            if(len(x) == 0):
                return None
            else:
                return x
