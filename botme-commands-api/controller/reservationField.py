
def reservationField(db,form,pageId,sectionId,value,text,intent):
    if db is not None:
            context = db['context']
            iD = getEntityClickAttribute(context['entities'])
            if not form[0]['entityValue']:
                form[0]['entityStatus'] = True
                return {"Response":"please fill the name field","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
            elif not form[1]['entityValue']:
                form[1]['entityStatus'] = True
                return {"Response":"please fill the number of person field","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
            elif not form[2]['entityValue']:
                form[2]['entityStatus'] = True
                return {"Response":"please fill the Date field","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
            elif not form[3]['entityValue']:
                form[3]['entityStatus'] = True
                return {"Response":"please fill the Time field","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
            elif form[0]['entityValue'] and form[1]['entityValue'] and form[2]['entityValue'] and form[3]['entityValue']:
                return {"Response":"you can now book your reservation","ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form}
            else:
                return {"Response":db['response'],"ctaCommandId":db['ctaCommandId'],"pageId":pageId,"sectionId":sectionId,"entityName":value,"entityId":iD['entityId'],"actionType":iD['actionType'],"sentimentScore":text,"intentName":intent,"entities":form} 

def getEntityClickAttribute(entity):
    for x in entity:
        return {"entityId":x['entityId'],"actionType":x['clickAttribute']}
