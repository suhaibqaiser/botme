import requests
import re

from requests.models import Response
from controller.reservationField import reservationField
from config import RESTAURANT_API 


class Reservation():
    def __init__(self,intent,value,senti,pageId,sectionId,text,db,form):
          
        self.intent = intent
        self.value = value
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.form = form

    def reservation(self):
        try:
            if self.db is not None:
                V = re.findall(r'\d+', self.value) 
                number = "".join(V)
                if number.isdigit():
                    Response = reservationField(self.db,self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                    return Response
                else:
                    return {"Response":"sorry,can you please tell me the number of people again?","ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}                 
            else:
                tableResponse = Reservation.searchingTable(self.value,self.senti,self.intent,self.text)
                return tableResponse
        except:
            print("error in parsing number of people")    

    def searchingTable(value,senti,intent,text):
        try:
            response = requests.get(RESTAURANT_API + 'food/tables/search?seats=' + value)
            data = response.json()
            if(data['status'] == "success"):
                table_no = Reservation.getTableNo(data['payload'])
                return {"Response":"you can move to the table number " + table_no,"ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
            else:
                return {"Response":"Sorry, All tables are occupied","ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
        except:
            return "error in searching for table"

    def getTableNo(payload):
        for x in payload:
            number = str(x['tableLabel'])
            return number

    def getEntityClickAttribute(entity):
        for x in entity:
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}








