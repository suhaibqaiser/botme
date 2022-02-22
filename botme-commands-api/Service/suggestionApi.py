import requests
from config import RESTAURANT_API
import json


def getProductId(entity, person, restaurantId):
    try:
        body = {"searchParameters": {"tags": entity,
                                     "persons": person}, "restaurantId": restaurantId}
        print("body ==>", body)
        response = requests.post(
            RESTAURANT_API + '/food/product/suggest', json=body)
        data = response.json()
        print("result ==>", data)
        return data
    except:
        return {"status": "error", "message": "", "timestamp": "Sat Feb 12 2022 23:07:20 GMT+0500 (Pakistan Standard Time)", "payload": "product not found"}
