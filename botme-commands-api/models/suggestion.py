from controller.utility import Utility
from Service.suggestionApi import getProductId , getProductIdByTime
from Service.restaurantApi import getProductUsingProductId

class Suggestion():
    def __init__(self, intent, entities, senti, pageId, sectionId, text, db, converstion, context, restaurantId):
        self.intent = intent
        self.entity = entities
        self.senti = senti
        self.pageId = pageId
        self.sectionId = sectionId
        self.text = text
        self.db = db
        self.form = None
        self.converstion = converstion
        self.context = context
        # self.searchParameter = searchParameter
        self.restaurantId = restaurantId
        self.call = None

    def suggestionResponse(self):
        print("here")
        suggestion = Suggestion.entityArray(self)
        print("here1")
        if self.intent == "Suggestion" or self.intent == "Order_meal" or self.intent == "menu_category":
            self.call = suggestion['keywords']
            persons = suggestion['persons']
            size = suggestion['size']
            flavour = suggestion['flavour']
            data = getProductId(suggestion, self.restaurantId)

        elif self.intent == "meal_time":
            self.call = suggestion['keywords']
            persons = suggestion['persons']
            size = suggestion['size']
            flavour = suggestion['flavour']
            data = getProductIdByTime(suggestion, self.restaurantId)


        if data['status'] == "success":
            value = data['payload']

            prod = value['products']
            drinks = value['drinks']
            addon = value['addons']
            ingredient = value['ingredient']

            product = prod + drinks + addon
            products = list(dict.fromkeys(product))
            print(products)

            if len(products) == 0:
                value = []
                utility = Utility(self.pageId, self.sectionId, value,
                                  self.text, self.intent, self.db, self.form, self.call)
                Response = utility.suggestionResponse()
                return Response
            else:
                value = Suggestion.getAllPackage(self,products,drinks,addon,ingredient,persons,size,flavour)
                utility = Utility(self.pageId, self.sectionId, value,
                                  self.text, self.intent, self.db, self.form, self.call)
                Response = utility.suggestionResponse()
                return Response
        else:
            value = None
            utility = Utility(self.pageId, self.sectionId, value,
                              self.text, self.intent, self.db, self.form, self.call)
            Response = utility.nluFallBack()
            return Response

    def entityArray(self):
        if self.intent == "Suggestion" or self.intent == "Order_meal" or self.intent == "menu_category":
            keywords = {"product":[],"quantity":[],"drink":[],"attributes":[],"servingSize":[],"addon":[],"ingredient":[],"flavour":[]}
            suggestion = {"product": [],"persons": 1,"drink": [],"attributes": {},"keywords": keywords,"size":"standard","addon":[],"ingredient":[],"flavour":""}
            for x in self.entity:
                if x['entity'] == 'suggestion' or x['entity'] == 'categoryName' or x['entity'] == 'productName':
                    valueProduct = x['value']
                    valueProduct = valueProduct.lower()
                    keywords['product'].append(valueProduct)
                    suggestion['product'].append(valueProduct)

                if x['entity'] == "number":
                    valueNumber = x['value']
                    keywords['quantity'].append(valueNumber)
                    suggestion['persons'] = int(valueNumber)

                if x['entity'] == "drink":
                    valueDrink = x['value']
                    valueDrink = valueDrink.lower()
                    keywords['drink'].append(valueDrink)
                    suggestion['drink'].append(valueDrink)

                if x['entity'] == "size":
                    size = x['value']
                    size = size.lower()
                    keywords['servingSize'].append(size)
                    suggestion['size'] = size

                if x['entity'] == "addon":
                    addon = x['value']
                    addon = addon.lower()
                    keywords['addon'].append(addon)
                    suggestion['addon'].append(addon)

                if x['entity'] == "ingredients":
                    ingredients = x['value']
                    ingredients = ingredients.lower()
                    keywords['ingredient'].append(ingredients)
                    suggestion['ingredient'].append(ingredients)

                if x['entity'] == "flavour":
                    flavour = x['value']
                    flavour = flavour.lower()
                    keywords['flavour'].append(flavour)
                    suggestion['flavour'] = flavour

                if x['entity'] == "attribute":
                    if x['value'] == "glutenFree":
                        keywords['attributes'].append(x['value'])
                        suggestion['attributes']['glutenFree'] = True

                    if x['value'] == "halal":
                        keywords['attributes'].append(x['value'])
                        suggestion['attributes']['halal'] = True

                    if x['value'] == "vegan":
                        keywords['attributes'].append(x['value'])
                        suggestion['attributes']['vegan'] = True

                    if x['value'] == "vegetarian":
                        keywords['attributes'].append(x['value'])
                        suggestion['attributes']['vegetarian'] = True

            print("suggestion==>",suggestion)
            return suggestion
        
        elif self.intent == "meal_time":
            keywords = {"product":[]}
            suggestion = {"product": [],"persons": 1,"drink": [],"attributes": {},"keywords": keywords,"size":"standard","addon":[],"ingredient":[],"flavour":""}
            for x in self.entity:
                if x['entity'] == "offeringTime":
                    tag = x['value']
                    tag = tag.lower()
                    keywords['product'].append(tag)
                    suggestion['product'].append(tag) 
            return suggestion

    def getAllPackage(self,productId,drinks,addon,ingredient,persons,size,flavour):
        package = []
        for Id in productId:
            obj = {"restaurantId":"","productId":"","productSerialNo":"","productCategory":"","productFlavor":"","productProportion":[],"productToppings":[],"productOptions":[],"productRate":{size:0},"productQuantity":"","productIngredients":[],"productNotes":"","productTotalPrice":0,"cartDiscount":0,"cartTotal":0}
            data = getProductUsingProductId(Id,self.restaurantId)
            if data['status'] == "success":
                value =data['payload']
                result = Suggestion.handlingProductAttributes(self,value,drinks,addon,ingredient,size,persons,flavour)
                obj['restaurantId'] = self.restaurantId
                obj['productId'] = Id

                obj['productRate'][size] = result['productRate']
                obj['productOptions'] = result['productOption']


                obj['productIngredients'] = result['productIngrident']
                obj['productFlavor'] =  result['productFlavour']

                obj['productToppings'] = result['productTopping']
                obj['productProportion'] = result['productAddon']

                obj['productQuantity'] = persons
                totalPrice = result['productPrice']
                obj['productTotalPrice'] = totalPrice
                package.append(obj)

        return package

    def handlingProductAttributes(self,product,drinks,addon,ingredient,size,persons,flavour):
        if len(product) > 0:
            for prod in product:
                productRate = Suggestion.productRate(prod['productRate'],size)
                print("FOR NEW PRODUCT")
                productOption = Suggestion.productOption(prod['productOptions'],addon,drinks)

                productIngrident = Suggestion.productIngredients(prod['productIngredients'])
                productFlavour = Suggestion.productFlavour(prod['productFlavor'],flavour) #to be done

                productTopping = Suggestion.productTopping(prod['productToppings'],ingredient)
                productAddon = Suggestion.productAddon(addon,drinks)

                productPrice = Suggestion.productPrice(self,prod['productRate'],size,productAddon,productTopping,persons)
                Result = {"productRate":productRate,"productOption":productOption,"productIngrident":productIngrident,"productFlavour":productFlavour,"productPrice":productPrice,"productTopping":productTopping,"productAddon":productAddon}
                return Result

    def productRate(rate,size):
        if size in rate:
            return rate[size]

    def productOption(productOption,addon,drinks):
        addon_drinks = addon + drinks
        print("addon_drinks",addon_drinks)
        # obj = {"productId":"","productQuantity":0}
        array = []
        add_array = []
        if productOption is not None:
            for options in productOption:
                add_array = add_array + options


            for id in addon_drinks:
                obj = {"productId":"","productQuantity":0}
                if id in add_array:
                    obj['productId'] = id
                    array.append(obj)

            print("array==>",array)
            return array
        else:
            return array

    def productIngredients(Ingredients):
        array = []
        if Ingredients is not None:
            if len(Ingredients) > 0:
                for ingred in Ingredients:
                    obj = {"productId":"","productQuantity":0}
                    obj['productId'] = ingred
                    array.append(obj)
                return array
            else:
                return array
        else:
            return array

    def productFlavour(productFlavor,flavour):
        if productFlavor is not None:
            if len(productFlavor) > 0:
                if flavour.title() in productFlavor:
                    prodFlavor = flavour.title()
                    return prodFlavor
                else:
                    return productFlavor[0]
            else:
                return productFlavor[0]
        else:
            return ""

    def productTopping(topping,ingredient):
        array = []
        if topping is not None:
            if len(ingredient) > 0:
                for ingred in ingredient:
                    obj = {"productId":"","productQuantity":1}
                    if ingred in topping:
                        obj['productId'] = ingred
                        array.append(obj)
                return array
            else:
                return array
        else:
            return array

    def productAddon(addon,drinks):
        productAddon = addon + drinks
        array = []
        for id in productAddon:
            obj = {"productId":"","productQuantity":1}
            obj['productId'] = id
            array.append(obj)

        return array

    def productPrice(self,Rate,size,addonPrice,toppingPrice,quantity):
        addon_Rate = Suggestion.addonToppingRate(self,addonPrice)
        topping_Rate = Suggestion.addonToppingRate(self,toppingPrice)
        if Rate[size]:
            price = (quantity*Rate[size]) + addon_Rate + topping_Rate
            print(price)
            return price

    def addonToppingRate(self,productPrice):
        totalRate = 0
        if productPrice is None:
            return totalRate
        else:
            if len(productPrice) > 0:
                for obj in productPrice:
                    id = obj['productId']
                    quantity = obj['productQuantity']
                    data = getProductUsingProductId(id,self.restaurantId)
                    if data['status'] == "success":
                        value =data['payload'][0]
                        Rate = value['productRate']['standard']
                        totalRate = quantity * Rate
                        return totalRate
                    else:
                        totalRate = 0
                        return totalRate
                return totalRate
            else:
                return totalRate
