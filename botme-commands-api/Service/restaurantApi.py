import requests
from requests.models import Response
from config import RESTAURANT_API
from datetime import datetime


def getProductUsingProductName(value,restaurantId):
    try:
        print(restaurantId)
        response = requests.get(RESTAURANT_API + '/food/product/search?productName='+value+'&restaurantId='+restaurantId)
        data = response.json()
        return data
    except:
        now = datetime.now()
        return {"status": "error","timestamp": now,"payload": "product not found"}

def getProductUsingProductId(id,restaurantId):
    try:
        print(id)
        response = requests.get(RESTAURANT_API + '/food/product/search?productId='+id+'&restaurantId='+restaurantId)
        data = response.json()
        return data
    except:
        now = datetime.now()
        return {"status": "error","timestamp": now,"payload": "product not found"}

def getAllCategory(restaurantId):
    try:
        Response = requests.get(RESTAURANT_API + '/food/category/all?restaurantId='+restaurantId)
        data = Response.json()
        print(data)
        return data
    except:
        now = datetime.now()
        return {"status": "error","timestamp": now,"payload": "error in getting categories"}
