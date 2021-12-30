from controller.reservationField import reservationField,checkIfFieldValueExist
from conf.mongodb import findResponse
from controller.utility import Utility

class Name():
    def __init__(self,intent,value,pageId,sectionId,text,db,form):
         
       self.intent = intent
       self.value = value
       self.pageId = pageId
       self.sectionId = sectionId
       self.text = text
       self.db = db
       self.form = form
    
    def name(self):
        if self.value:
            Response = Name.nameFromRasa(self.intent,self.value,self.pageId,self.sectionId,self.text,self.db,self.form)
            return Response                 
        else:
            Response = Name.nameNotFromRasa(self.intent,self.value,self.pageId,self.sectionId,self.text,self.db,self.form)
            return Response
            
    def nameFromRasa(intent,value,pageId,sectionId,text,db,form):
        val = Name.validateName(value)
        if (val is not None):
            if Name.checkIfExist(value):
                if Name.checkingForNameFocus(form):
                    call = None
                    utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
                    Response = utility.incorrectName()
                    return Response
                else:
                    Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                    return Response
            else:
                Response = reservationField(db,form,pageId,sectionId,value,text,intent)
                return Response
        else:
            if Name.checkingForNameFocus(form):
                call = None
                utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
                Response = utility.incorrectName()
                return Response
            else:
                Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                return Response

    def nameNotFromRasa(intent,value,pageId,sectionId,text,db,form):
        try:
            txt = text.split()
            if Name.checkIfExistInArray(txt):
                x = len(txt)
                name = txt[x-1]
                name2 = txt[x-2]
                newName = name2 +" "+name
                val = Name.validateName(newName)
                value = val.split()
                if val:
                    if Name.checkIfExistInArray(value):
                        if Name.checkingForNameFocus(form):
                            call = None
                            utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
                            Response = utility.incorrectName()
                            return Response
                        else:
                            Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                            return Response
                    else:
                        Response = reservationField(db,form,pageId,sectionId,val,text,intent)
                        return Response
                else:
                    val = Name.validateName(name)
                    if val:
                        if Name.checkIfExist(val):
                            if Name.checkingForNameFocus(form):
                                call = None
                                utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
                                Response = utility.incorrectName()
                                return Response
                            else:
                                Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                                return Response
                        else:
                            Response = reservationField(db,form,pageId,sectionId,val,text,intent)
                            return Response
                    else:
                        if Name.checkingForNameFocus(form):
                            call = None
                            utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
                            Response = utility.incorrectName()
                            return Response
                        else:
                            Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                            return Response
            else:
                if Name.checkingForNameFocus(form):
                    call = None
                    utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
                    Response = utility.incorrectName()
                    return Response
                else:
                    Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                    return Response
        except:
            if Name.checkingForNameFocus(form):
                call = None
                utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
                Response = utility.incorrectName()
                return Response
            else:
                Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                return Response


    def validateName(value):
        if value:
            val = value.replace(" ","").isalpha()
            if val:
                return value
            else:
                 return None
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

    def checkingForNameFocus(form):
        name = "name"
        for x in form:
            if x['entitySelected'] == True:
                if x['entityId'] == findResponse(name):
                    return True
                else:
                    return False
