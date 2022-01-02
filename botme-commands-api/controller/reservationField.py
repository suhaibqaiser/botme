from requests.models import Response
from conf.mongodb import findResponse
from controller.utility import Utility

def reservationField(db,form,pageId,sectionId,value,text,intent):
    if db is not None:
            if intent == "reservation_page":
                form = formInitialization(form)
                return form

            elif intent == "inform_name":
                val = "name"
                entityId = findResponse(val)
                Response = Field(db,form,pageId,sectionId,value,text,intent,entityId)
                return Response
            
            elif intent == "unreserved_table_person":
                val = "person"
                entityId = findResponse(val)
                Response = Field(db,form,pageId,sectionId,value,text,intent,entityId)
                print(Response)
                return Response
            
            elif intent == "inform_date":
                val = "date"
                entityId = findResponse(val)
                Response = Field(db,form,pageId,sectionId,value,text,intent,entityId)
                return Response
            
            elif intent == "inform_time":
                val = "time"
                entityId = findResponse(val)
                Response = Field(db,form,pageId,sectionId,value,text,intent,entityId)
                print(Response)
                return Response
            
            elif intent == "book_now":
                Response = checkingIfFieldValueExist(db,form,pageId,sectionId,value,text,intent)
                return Response

def checkingIfFieldValueExist(db,form,pageId,sectionId,value,text,intent):
    name = "name"
    person = "person"
    date = "date"
    time = "time"
    call = None
    print("new form ==>",form)
    utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
    for x in form:
        if not x['entityValue']:
            if x['entityId'] == findResponse(name):
                x['entitySelected'] = True
                response = utility.nameField()
                return response

            elif x['entityId'] == findResponse(person):
                x['entitySelected'] = True
                response = utility.personField()
                return response

            elif x['entityId'] == findResponse(date):
                x['entitySelected'] = True
                response = utility.dateField()
                return response

            elif x['entityId'] == findResponse(time):
                x['entitySelected'] = True
                response = utility.timeField()
                return response
    Response = utility.bookNowResponse() 
    return Response

def checkIfFieldValueExist(form,pageId,sectionId,value,text,intent):
    name = "name"
    person = "person"
    date = "date"
    time = "time"
    db = None
    call = None
    utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
    for x in form:
        if x['entitySelected'] == True:
            if x['entityId'] == findResponse(name):
                response = utility.nameField()
                return response

            elif x['entityId'] == findResponse(person):
                response = utility.personField()
                return response

            elif x['entityId'] == findResponse(date):
                response = utility.dateField()
                return response

            elif x['entityId'] == findResponse(time):
                response = utility.timeField()
                return response

def formInitialization(form):
    name = "name"
    entityId =  findResponse(name)
    for x in form:
        if x['entityId'] == entityId:
            x['entityValue'] = ""
            x['entitySelected'] = True
        else:
            x['entityValue'] = ""
            x['entitySelected'] = False
    return form

def Field(db,form,pageId,sectionId,value,text,intent,entityId):
    for x in form:
        if x['entitySelected'] == True:
            if x['entityId'] == entityId:
                x['entityValue'] = value
                x['entitySelected'] = False
                call = None
                utility = Utility(pageId,sectionId,value,text,intent,db,form,call)
                Response = utility.findNextFieldFocus()
                return Response
            else:
                Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                return Response

def checkForEmptyField(form):
    form = resetFieldFocus(form)
    for x in form:
        if not x['entityValue']:
            x['entitySelected'] = True
            return form
    return form

def resetFieldFocus(form):
    for x in form:
        x['entitySelected'] = False
    return form