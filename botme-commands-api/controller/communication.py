from conf.mongodb import getDbCta, findResponse
from textblob import TextBlob
from controller.utility import Utility
from models.Entity import Entity
from models.Name import Name
from models.Products import Product
from models.Reservation import Reservation
from models.DateTime import DateTime
from models.categories import Category
from models.suggestion import Suggestion
from controller.reservationField import reservationField, checkForEmptyField, validationOfFields

# reminder need to change text to senti in responses


def getResponseUsingContext(intent, entity, text, pageId, sectionId, form, parentEntity, converstion, context, restaurantId,searchParameter):
    blob = TextBlob(text)
    senti = blob.sentiment.polarity
    val = Entity(entity, intent)
    value = val.parseEntityValue()
    db = getDbCta(intent, value, pageId, sectionId)
    form = checkForEmptyField(form)
    if (pageId == "pageId-home"):
        if intent == "Suggestion" or intent == "menu_category":
            suggestion = Suggestion(intent, entity, senti, pageId,
                                    sectionId, text, db, converstion, context, restaurantId, searchParameter)
            Response = suggestion.suggestionResponse()
            return Response

    elif (pageId == "pageId-order-online" or pageId == "pageId-cart-modal" or pageId == "pageId-cart"):
        if intent == "Order_meal" or intent == "remove_item" or intent == "reduce_product_quantity" or intent == "product_flavour" or intent == "product-detail" or intent == "remove_item" or intent == "edit_product":
            product = Product(intent, value, senti, pageId, sectionId,
                              text, db, parentEntity, converstion, context)
            Response = product.ProductResponseIfNoParentEntity()
            return Response
        elif intent == "menu_category":
            category = Category(intent, value, senti, pageId,
                                sectionId, text, db, converstion, context)
            Response = category.getCategoryResponse()
            return Response
        else:
            call = None
            utility = Utility(pageId, sectionId, value,
                              text, intent, db, form, call)
            response = utility.dbResponse()
            return response

    elif (pageId == "pageId-product-customize-modal"):
        if intent == "Order_meal" or intent == "remove_item" or intent == "reduce_product_quantity" or intent == "product_flavour" or intent == "product-detail" or intent == "remove_item":
            product = Product(intent, value, senti, pageId, sectionId,
                              text, db, parentEntity, converstion, context)
            Response = product.productResponseIfParentEntity()
            return Response
        else:
            call = None
            utility = Utility(pageId, sectionId, value,
                              text, intent, db, form, call)
            response = utility.dbResponse()
            return response

    elif (pageId == "pageId-reservation"):
        if (intent == "reservation_page"):
            form = reservationField(
                db, form, pageId, sectionId, value, text, intent)
            call = None
            utility = Utility(pageId, sectionId, value,
                              text, intent, db, form, call)
            response = utility.reservationResponse()
            return response

        elif (intent == "inform_name"):
            name = Name(intent, value, pageId, sectionId, text, db, form)
            utility = Utility(pageId, sectionId, value,
                              text, intent, db, form, name)
            response = utility.nameResponse()
            return response

        elif (intent == "unreserved_table_person"):
            reservation = Reservation(
                intent, value, pageId, sectionId, text, db, form)
            utility = Utility(pageId, sectionId, value, text,
                              intent, db, form, reservation)
            Response = utility.personResponse()
            return Response

        elif (intent == "inform_date"):
            date = DateTime(intent, value, pageId, sectionId, text, db, form)
            utility = Utility(pageId, sectionId, value,
                              text, intent, db, form, date)
            response = utility.dateResponse()
            return response

        elif (intent == "inform_time"):
            time = DateTime(intent, value, pageId, sectionId, text, db, form)
            utility = Utility(pageId, sectionId, value,
                              text, intent, db, form, time)
            response = utility.timeResponse()
            return response

        elif (intent == "book_now"):
            Form = validationOfFields(form)
            print(Form)
            if Form:
                Response = reservationField(
                    db, form, pageId, sectionId, value, text, intent)
                return Response
            else:
                call = None
                utility = Utility(pageId, sectionId, value,
                                  text, intent, db, form, call)
                response = utility.formValidationResponse()
                return response
        else:
            call = None
            utility = Utility(pageId, sectionId, value,
                              text, intent, db, form, call)
            response = utility.dbResponse()
            return response

    else:
        call = None
        utility = Utility(pageId, sectionId, value,
                          text, intent, db, form, call)
        response = utility.dbResponse()
        return response
