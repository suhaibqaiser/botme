from pymongo import response
from Service.restaurantApi import getAllCategory
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
        data = getAllCategory(self.context['restaurantId'])
        payload = data['payload']
        category = Category.checkForCategory(self.value,payload,self.context['restaurantId'])
        print("category ==>",category)
        if category :
            if Category.checkIfCategoryActive(category):
                call = category['categoryId']
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

    def checkForCategory(value,payload,restaurantId):
        for x in payload:
            print(x)
            if x['categoryName'] == value.title() and x['restaurantId'] == restaurantId:
                return x
        return None

    def checkIfCategoryActive(category):
        if category['categoryActive'] == True:
            return True
        else:
            return False
        
        