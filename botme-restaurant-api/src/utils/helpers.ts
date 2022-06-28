// import { placeOrderNotification } from "../modules/notification/place-order-notification/controller";
// import { getSubscriptionByClientId } from "../modules/notification/place-order-notification/service";



// export async function sendingPlaceOrderNotification(clientId:any,title:any,body:any) {

//     console.log("clientId==>",clientId)
//     let subscription = await getSubscriptionByClientId(clientId)

//     if(subscription.length !=0) {
//         for (let subsribe of subscription) {
//             console.log("subscription ==>",subsribe.subscription)
//             await placeOrderNotification(subsribe.subscription,title,body)
//         }
//     }
// }