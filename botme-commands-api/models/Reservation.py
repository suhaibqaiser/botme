# import requests
import re
from requests.models import Response
from controller.reservationField import reservationField,checkIfFieldValueExist
from config import RESTAURANT_API 
from conf.mongodb import findResponse
from models.Name import Name
from controller.utility import Utility


class Reservation():
    def __init__(self,intent,value,pageId,sectionId,text,db,form):
          
        self.intent = intent
        self.value = value
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.form = form

    def reservation(self):
        try:
            if self.value:
                V = re.findall(r'\d+', self.value) 
                number = "".join(V)
                if number.isdigit():
                    Response = reservationField(self.db,self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                    return Response
                else:
                    if Reservation.checkForPersonFieldFocus(self.form):
                        number = "9"
                        return {"Response":findResponse(number),"ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                    else:
                        Response = checkIfFieldValueExist(self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                        return Response  
            else:
                if Reservation.checkForPersonFieldFocus(self.form):
                    call = None
                    utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                    Response = utility.incorrectPersonResponse()
                    return Response
                else:
                    Response = checkIfFieldValueExist(self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                    return Response        
            # else:
            #     tableResponse = Reservation.searchingTable(self.value,self.senti,self.intent,self.text)
            #     return tableResponse
        except:
            if Reservation.checkForPersonFieldFocus(self.form):
                call = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                Response = utility.incorrectPersonResponse()
                return Response
            else:
                Response = checkIfFieldValueExist(self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                return Response   

    # def searchingTable(value,senti,intent,text):
    #     try:
    #         response = requests.get(RESTAURANT_API + 'food/tables/search?seats=' + value)
    #         data = response.json()
    #         if(data['status'] == "success"):
    #             table_no = Reservation.getTableNo(data['payload'])
    #             number = "11"
    #             return {"Response":findResponse(number) + table_no,"ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
    #         else:
    #             number = "10"
    #             return {"Response":findResponse(number),"ctaCommandId":None,"pageId":None,"sectionId":None,"entityName":None,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent}
    #     except:
    #         return "error in searching for table"

    def getTableNo(payload):
        for x in payload:
            number = str(x['tableLabel'])
            return number

    def getEntityClickAttribute(entity):
        for x in entity:
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}
    
    def checkForPersonFieldFocus(form):
        person = "person"
        for x in form:
            if x['entityStatus'] == True:
                if x['entityId'] == findResponse(person):
                    return True
                else:
                    return False









