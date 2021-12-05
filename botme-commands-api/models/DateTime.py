import dateparser
from timefhuman import timefhuman
from datetime import datetime

class DateTime():
    def __init__(self,intent,value,senti,pageId,sectionId,text,db,form,reservationField):
          
        self.intent = intent
        self.value = value
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.form = form
        self.reservationField = reservationField


    def parseDate(self):
        context = self.db['context']
        iD = DateTime.getEntityClickAttribute(context['entities'])    
        try:                   
            t = dateparser.parse(self.text)
            print("time =>" ,t)
            if t is not None:
                print("dateparser call")
                time = t.strftime("%Y-%m-%d")
                if self.form[2]:
                    self.form[2]['entityValue'] = time
                    self.form[2]['entityStatus'] = False
                    Response = self.reservationField
                    return Response
                else:
                    self.form[2]['entityValue'] = time
                    self.form[2]['entityStatus'] = False
                    if not self.form[3]['entityValue']:
                        self.form[3]['entityStatus'] = True
                        return {"Response":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":time,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                    else:
                        Resp = self.reservationField
                        return Resp
            else:
                print("timefhuman call")
                now = datetime.now()
                t = timefhuman(self.text,now=now)
                if t:
                    time = t.strftime("%Y-%m-%d")
                    if self.form[2]:
                        self.form[2]['entityValue'] = time
                        self.form[2]['entityStatus'] = False
                        Response = self.reservationField
                        return Response
                    else:
                        self.form[2]['entityValue'] = time
                        self.form[2]['entityStatus'] = False
                        if not self.form[3]['entityValue']:
                            self.form[3]['entityStatus'] = True
                            return {"Response":self.db['response'],"ctaCommandId":self.db['ctaCommandId'],"pageId":self.pageId,"sectionId":self.sectionId,"entityName":time,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                        else:
                            Resp = self.reservationField
                            return Resp
                else:
                    return {"Response":"sorry,can you please tell me the day again?","ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}                      
        except:
            return "Error in parsing date"

    def parseTime(self):
        context = self.db['context']
        iD = DateTime.getEntityClickAttribute(context['entities'])
        try:
            t = dateparser.parse(self.text)
            print("time =>" ,t)
            if t is not None:
                print("dateparser call")
                time = t.strftime("%H:%M:%S")
                if self.form[3]:
                    self.form[3]['entityValue'] = time
                    self.form[3]['entityStatus'] = False
                    Response = self.reservationField
                    return Response
                else:
                    self.form[3]['entityValue'] = time
                    self.form[3]['entityStatus'] = False
                    Response = self.reservationField
                    return Response
            else:
                print("timefhuman call")
                now = datetime.now()
                t = timefhuman(self.text,now=now)
                print(t)
                if t:
                    time = t.strftime("%H:%M:%S")
                    if self.form[3]:
                        self.form[3]['entityValue'] = time
                        self.form[3]['entityStatus'] = False
                        Response = self.reservationField
                        return Response
                    else:
                        self.form[3]['entityValue'] = time
                        self.form[3]['entityStatus'] = False
                        Response =self.reservationField
                        return Response
                else:
                    return {"Response":"sorry,can you please tell me the time again?","ctaCommandId":None,"pageId":self.ageId,"sectionId":self.sectionId,"entityName":"","entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
        except:
            return "Error in parsing date"
    
    def getEntityClickAttribute(entity):
        for x in entity:
            print(x)
            return {"entityId":x['entityId'],"actionType":x['clickAttribute']}