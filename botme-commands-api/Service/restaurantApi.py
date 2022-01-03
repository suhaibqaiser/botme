import requests
from config import RESTAURANT_API
from datetime import datetime


def getProductUsingProductName(value):
    try:
        response = requests.get(RESTAURANT_API + '/food/product/search?productName='+value)
        data = response.json()
        return data
    except:
        now = datetime.now()
        return {"status": "error","timestamp": now,"payload": "product not found"}

def getProductUsingProductId(id):
    try:
        print(id)
        response = requests.get(RESTAURANT_API + '/food/product/search?productId='+id)
        data = response.json()
        return data
    except:
        now = datetime.now()
        return {"status": "error","timestamp": now,"payload": "product not found"}