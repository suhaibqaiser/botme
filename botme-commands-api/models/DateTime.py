import dateparser
from timefhuman import timefhuman
from datetime import datetime
from controller.reservationField import reservationField,checkIfFieldValueExist
from conf.mongodb import findResponse
from controller.utility import Utility

class DateTime():
    def __init__(self,intent,value,pageId,sectionId,text,db,form):
          
        self.intent = intent
        self.value = value
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.form = form

    def parseDate(self): 
        try:                   
            t = dateparser.parse(self.text)
            print("time =>" ,t)
            if t:
                print("dateparser call")
                time = t.strftime("%Y-%m-%d")
                Response = reservationField(self.db,self.form,self.pageId,self.sectionId,time,self.text,self.intent)
                return Response
            else:
                print("timefhuman call")
                now = datetime.now()
                t = timefhuman(self.text,now=now)
                if t:
                    time = t.strftime("%Y-%m-%d")
                    Response = reservationField(self.db,self.form,self.pageId,self.sectionId,time,self.text,self.intent)
                    return Response
                else:
                    date = "date"
                    if DateTime.checkForDateTimeFieldFocus(self.form,date):
                        call = None
                        utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                        Response = utility.incorrectDate()
                        return Response 
                    else:
                        Response = checkIfFieldValueExist(self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                        return Response                     
        except:
            date = "date"
            if DateTime.checkForDateTimeFieldFocus(self.form,date):
                call = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                Response = utility.incorrectDate()
                return Response 
            else:
                Response = checkIfFieldValueExist(self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                return Response

    def parseTime(self):
        try:
            t = dateparser.parse(self.value)
            print("time =>" ,t)
            if t is not None:
                print("dateparser call")
                time = t.strftime("%H:%M:%S")
                print(time)
                Response = reservationField(self.db,self.form,self.pageId,self.sectionId,time,self.text,self.intent)
                print(Response)
                return Response
            else:
                print("timefhuman call")
                now = datetime.now()
                print(self.value)
                t = timefhuman(self.value,now=now)
                print("time =>",t)
                if t:
                    time = t.strftime("%H:%M:%S")    
                    Response = reservationField(self.db,self.form,self.pageId,self.sectionId,time,self.text,self.intent)
                    return Response
                else:
                    time = "time"
                    if DateTime.checkForDateTimeFieldFocus(self.form,time):
                        call = None
                        utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                        Response = utility.incorrectTime()
                        return Response
                    else:
                        Response = checkIfFieldValueExist(self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                        return Response
        except:
            time = "time"
            if DateTime.checkForDateTimeFieldFocus(self.form,time):
                call = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                Response = utility.incorrectTime()
                return Response
            else:
                Response = checkIfFieldValueExist(self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                return Response   

    def checkForDateTimeFieldFocus(form,value):
        for x in form:
            if x['entitySelected'] == True:
               if x['entityId'] == findResponse(value):
                   return True
               else:
                   return False