import { OrderNotification } from "../modules/notification/order-notification/controller"
import { GetAllSubscription } from "../modules/notification/order-notification/service"



export async function sendingPlaceOrderNotification(customerName:any,orderLabel:any,restaurantId:any,total:any) {

    try{
        let body = {"customerName":customerName,"orderLabel":orderLabel,"restaurantId":restaurantId,"total":total}

        let subscription = await GetAllSubscription(restaurantId)
        
        if (subscription.length != 0){
            for (let val of subscription) {
                if (val.notificationType == "Order"){
                    await OrderNotification(body,val.subscription)
                }
            }
        }
    } catch(err) {
        console.log("error in sending notification")
    }
}