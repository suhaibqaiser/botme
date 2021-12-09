from controller.reservationField import reservationField

class Name():
    def __init__(self,intent,value,senti,pageId,sectionId,text,db,form):
         
       self.intent = intent
       self.value = value
       self.senti = senti
       self.pageId = pageId
       self.sectionId = sectionId
       self.text = text
       self.db = db
       self.form = form
    
    def name(self):
        for x in self.form:
            if x['entityId'] == "entityId-name":
                val = Name.validateName(self.value)
                if (val is not None):
                    if Name.checkIfExist(self.value):
                        return {"Response":"sorry,can you please tell me your name again?","ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                    else:
                        Response = reservationField(self.db,self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                        return Response                         
                else:
                    txt = self.text.split()
                    if Name.checkIfExistInArray(txt):
                        x = len(txt)
                        name = txt[x-1]
                        print(name)
                        if Name.checkIfExist(name):
                            return {"Response":"sorry,can you please tell me your name again?","ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}
                        else:
                            Response = reservationField(self.db,self.form,self.pageId,self.sectionId,self.value,self.text,self.intent)
                            return
                    else:
                        return {"Response":"sorry,can you please tell me your name again?","ctaCommandId":None,"pageId":self.pageId,"sectionId":self.sectionId,"entityName":self.value,"entityId":None,"actionType":None,"sentimentScore":self.text,"intentName":self.intent,"entities":self.form}

    def validateName(value):
        val = value.replace(" ","")
        if val.isalpha():
            return value
        else:
            return None

    def checkIfExist(value):
        if value == "my":
            return True
        elif value == "name":
            return True
        elif value == "is":
            return True
        else:
            return False
    
    def checkIfExistInArray(text):
        if "my" in text:
            return True
        elif "name" in text:
            return True
        elif "is" in text:
            return True
        else:
            return False 

