from urllib import response
import requests
from config import RESTAURANT_API
import json


def getProductId(suggestion, restaurantId):
    try:
        body = {"searchParameters":{
            "tags":suggestion['product'],
            "attributes":suggestion['attributes'],
            "drinks":suggestion['drink'],
            "addon":suggestion['addon'],
            "ingredient":suggestion['ingredient'],
            "persons":suggestion['persons']},"restaurantId":restaurantId}
        response = requests.post(
            RESTAURANT_API + '/food/product/suggest', json=body)
        data = response.json()
        print("result ==>", data)
        return data
    except:
        return {"status": "error", "message": "", "timestamp": "Sat Feb 12 2022 23:07:20 GMT+0500 (Pakistan Standard Time)", "payload": "product not found"}


def getProductIdByTime(suggestion, restaurantId):
    try:
        body = {"searchParameters":{
            "tags":suggestion['product']
        },"restaurantId":restaurantId}
        response = requests.post(
            RESTAURANT_API + '/food/product/suggest/offeringTime', json=body)
        data = response.json()
        print("result ==>", data)
        return data
    except:
        return {"status": "error", "message": "", "timestamp": "Sat Feb 12 2022 23:07:20 GMT+0500 (Pakistan Standard Time)", "payload": "product not found"}


def getAllProducts(restaurantId):
    try:
        print("getting all products")
        response = requests.get(RESTAURANT_API + '/food/product/search?restaurantId='+restaurantId)
        data = response.json()
        return data
    except:
        return {"status": "error", "message": "", "timestamp": "Sat Feb 12 2022 23:07:20 GMT+0500 (Pakistan Standard Time)", "payload": "product not found"}
