// import { OrderNotification } from "../modules/notification/order-notification/controller"
// import { GetAllSubscription } from "../modules/notification/order-notification/service"

import { queryOrder } from "../modules/food/order/service"



// export async function sendingPlaceOrderNotification(customerName:any,orderLabel:any,restaurantId:any,total:any) {

//     try{
//         let body = {"customerName":customerName,"orderLabel":orderLabel,"restaurantId":restaurantId,"total":total}

//         let subscription = await GetAllSubscription(restaurantId)
        
//         if (subscription.length != 0){
//             for (let val of subscription) {
//                 if (val.notificationType == "Order"){
//                     await OrderNotification(body,val.subscription)
//                 }
//             }
//         }
//     } catch(err) {
//         console.log("error in sending notification")
//     }
// }

export async function computeOrderSummaryNotification(restaurantId:any) {
    let filter = {orderTimestamp: {},restaurantId:""}
    let summary = {orderCancel: 0, orderdelivered: 0, orderInProgress: 0, totalEarning: 0 }

    console.log("restaurantId==>",restaurantId)

    //getting orders by date
    let date = new Date()
    let newDate = new Date(date.toISOString().split('T')[0])
    let fromDate = new Date(newDate)
    let toDate = new Date(newDate)
    toDate.setDate(date.getDate() + 1)

    let orderTimestamp = {$gte: fromDate,$lt: toDate}

    console.log("orderTimeStamp==>",orderTimestamp)

    filter.orderTimestamp = orderTimestamp
    filter.restaurantId = restaurantId

    console.log("filter==>",filter)

    let result = await queryOrder(filter)
    console.log("result==>",result.length)

    if (result.length != 0){
        for (let order of result){
            if(order.orderStatus == "notified"){
                summary.orderInProgress = summary.orderInProgress + 1
            } else if (order.orderStatus == "delivered") {
                summary.orderdelivered = summary.orderdelivered + 1
            } else if (order.orderStatus == "cancel") {
                summary.orderCancel = summary.orderCancel + 1
            }
        }
        let total = await computeTotalEarning(result)
        summary.totalEarning = total 
        return summary
    } else {
        return summary
    }    
}
export async function computeTotalEarning(orders:any) {
    let total = 0 
    for (let order of orders){
        if (order.orderStatus == "notified" || order.orderStatus == "delivered"){
            total = total + order.orderTotal
        }
    }
    return total
   
}
