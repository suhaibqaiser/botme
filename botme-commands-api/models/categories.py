from pymongo import response
from Service.restaurantApi import getCategory
from controller.utility import Utility

class Category:
    def __init__(self,intent,value,senti,pageId,sectionId,text,db,converstion,context):
          
        self.intent = intent
        self.value = value
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.form = None
        self.converstion = converstion
        self.context = context
    
    def getCategoryResponse(self):
        data = getCategory(self.value,self.context['restaurantId'])
        print(data)
        payload = data['payload']
        # category = Category.checkForCategory(self.value,payload,self.context['restaurantId'])
        # print("category ==>",category)
        if data['status'] == "success":
            # call = payload[0]['categoryId']
            # utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
            # response = utility.categoryResponse()
            # return response
            if payload[0]['categoryActive'] == True:
                call = payload[0]['categoryId']
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                response = utility.categoryResponse()
                return response
            else:
                call = None
                utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
                response = utility.ifCategoryNotActive()
                return response
        else:
            call = None
            utility = Utility(self.pageId,self.sectionId,self.value,self.text,self.intent,self.db,self.form,call)
            response = utility.ifNoCategory()
            return response    

    
        