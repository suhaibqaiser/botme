
def reservationField(db,form,pageId,sectionId,value,text,intent):
    if db is not None:
            if intent == "reservation_page":
                form = formInitialization(form)
                return form

            elif intent == "inform_name":
                entityId = "entityId-name"
                Response = Field(db,form,pageId,sectionId,value,text,intent,entityId)
                return Response
            
            elif intent == "unreserved_table_person":
                entityId = "entityId-number-of-persons"
                Response = Field(db,form,pageId,sectionId,value,text,intent,entityId)
                print(Response)
                return Response
            
            elif intent == "inform_date":
                entityId = "entityId-date"
                Response = Field(db,form,pageId,sectionId,value,text,intent,entityId)
                return Response
            
            elif intent == "inform_time":
                entityId = "entityId-time"
                Response = Field(db,form,pageId,sectionId,value,text,intent,entityId)
                print(Response)
                return Response
            
            elif intent == "book_now":
                Response = findRemainingFieldFocus(db,form,pageId,sectionId,value,text,intent)
                return Response

def findRemainingFieldFocus(db,form,pageId,sectionId,value,text,intent):
    for x in form:
        context = db['context']
        iD = getEntityClickAttribute(context['entities'])
        if not x['entityValue']:
            if x['entityId'] == "entityId-name":
                x['entityStatus'] = True
                return {"Response":"please fill the name field","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
            # lookupfield["keyEntityNoOfPers"]
            elif x['entityId'] == "entityId-number-of-persons":
                x['entityStatus'] = True
                return {"Response":"please fill the number of person field","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == "entityId-date":
                x['entityStatus'] = True
                return {"Response":"please fill the Date field","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == "entityId-time":
                x['entityStatus'] = True
                return {"Response":"please fill the Time field","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

        # else:
        #     return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form} 

    return {"Response":"you can now book your reservation","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
       
def checkIfFieldValueExist(db,form,pageId,sectionId,value,text,intent):
    context = db['context']
    iD = getEntityClickAttribute(context['entities'])
    for x in form:
        if not x['entityValue']:
            if x['entityId'] == "entityId-name":
                x['entityStatus'] = True
                return {"Response":"please tell me your name?","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == "entityId-number-of-persons":
                x['entityStatus'] = True
                return {"Response":"For how many people you want to make reservation?","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == "entityId-date":
                x['entityStatus'] = True
                return {"Response":"Do you want to make reservation for today or tomorrow or some other day","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

            elif x['entityId'] == "entityId-time":
                x['entityStatus'] = True
                return {"Response":"what time you want to make reservation?","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}

    Response = {"Response":"you can now book your reservation","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
    return Response

# def findNextFieldFocus(db,form,pageId,sectionId,value,text,intent):
#     for x in form:
#         print(x)
#         context = db['context']
#         iD = getEntityClickAttribute(context['entities'])
#         if not x['entityValue']:
#             x['entityStatus'] = True
#             return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form} 

def getEntityClickAttribute(entity):
    for x in entity:
        return {"entityId":x['entityId'],"actionType":x['clickAttribute']}

def formInitialization(form):
    for x in form:
        if x['entityId'] == "entityId-name":
            x['entityValue'] = ""
            x['entityStatus'] = True
        else:
            x['entityValue'] = ""
            x['entityStatus'] = False
    return form

def Field(db,form,pageId,sectionId,value,text,intent,entityId):
    for x in form:
        if x['entityId'] == entityId:
            if x['entityValue']:
                x['entityValue'] = value
                x['entityStatus'] = False
                Response = findRemainingFieldFocus(db,form,pageId,sectionId,value,text,intent)
                print("1 ==>", Response)
                return Response
            elif not x['entityValue']:
                x['entityValue'] = value
                x['entityStatus'] = False
                Response = checkIfFieldValueExist(db,form,pageId,sectionId,value,text,intent)
                return Response
                # else:
                #     Response = findNextFieldFocus(db,form,pageId,sectionId,value,text,intent)
                #     print("2 ==>", Response)
                #     return Response

    

