from conf.mongodb import findResponse

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
    for x in form:
        context = db['context']
        iD = getEntityClickAttribute(context['entities'])
        if not x['entityValue']:
            if x['entityId'] == findResponse(name):
                x['entityStatus'] = True
                number = "12"
                return {"Response":findResponse(number),"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
            # lookupfield["keyEntityNoOfPers"]
            elif x['entityId'] == findResponse(person):
                x['entityStatus'] = True
                number = "13"
                return {"Response":findResponse(number),"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == findResponse(date):
                x['entityStatus'] = True
                number = "14"
                return {"Response":findResponse(number),"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == findResponse(time):
                x['entityStatus'] = True
                number = "15"
                return {"Response":findResponse(number),"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

    return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
       
def checkIfFieldValueExist(form,pageId,sectionId,value,text,intent):
    name = "name"
    person = "person"
    date = "date"
    time = "time"
    for x in form:
        if x['entityStatus'] == True:
            if x['entityId'] == findResponse(name):
                number = "12"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == findResponse(person):
                number = "13"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == findResponse(date):
                number = "14"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == findResponse(time):
                number = "15"
                return {"Response":findResponse(number),"ctaCommandId":None,"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":None,"actionType":None,"sentimentScore":text,"intentName":intent,"entities":form}

def findNextFieldFocus(db,form,pageId,sectionId,value,text,intent):
    context = db['context']
    iD = getEntityClickAttribute(context['entities'])
    for x in form:
        if not x['entityValue']:
            x['entityStatus'] = True
            return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
    return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
         
def getEntityClickAttribute(entity):
    for x in entity:
        return {"entityId":x['entityId'],"actionType":x['clickAttribute']}

def formInitialization(form):
    name = "name"
    entityId =  findResponse(name)
    for x in form:
        if x['entityId'] == entityId:
            x['entityValue'] = ""
            x['entityStatus'] = True
        else:
            x['entityValue'] = ""
            x['entityStatus'] = False
    return form

def Field(db,form,pageId,sectionId,value,text,intent,entityId):
    print(form)
    for x in form:
        print(x)
        if x['entityStatus'] == True:
            if x['entityId'] == entityId:
                x['entityValue'] = value
                x['entityStatus'] = False
                Response = findNextFieldFocus(db,form,pageId,sectionId,value,text,intent)
                return Response
            else:
                Response = checkIfFieldValueExist(form,pageId,sectionId,value,text,intent)
                return Response
