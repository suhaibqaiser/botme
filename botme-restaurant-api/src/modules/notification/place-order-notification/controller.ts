// import {restResponse} from "../../../utils/response";
// import { checkIfSubscriptionExist, saveSubscriptions } from "./service";


// const webPush = require('web-push');

// const publicKey = 'BASpDNILoNMWYHhzrhEY6QKqFZqH8FOtybXu_3fqVk1lxbWNYU1VAmigQuN2u8lahgGOiW-FGHrWmrDwpbQ1-l0';
// const privateKey = 'PhOBfVwSvRnXMzqSyuL4FZtUWTS3p8sMwH0GehRScTw';

// export async function saveSubscription(req: any){
//     let response = new restResponse

//     let check = await checkIfSubscriptionExist(req)

//     if (check.length != 0){
//         console.log("subscription already exists")
//         response.payload = "subscription already exists"
//         response.status = "danger"
//         return response
//     }

//     let result = await saveSubscriptions(req)
//     if(result){
//         response.payload = result
//         response.status = "success"
//         return response
//     } else {
//         response.payload = result
//         response.status = "error"
//         return response
//     }
// }

// export async function placeOrderNotification(subscription:any,title: any,body: any) {
//     try {
//         webPush.setVapidDetails('mailto:abc@example.com', publicKey, privateKey);

//         const payload = JSON.stringify({
//             title: title,
//             body: body,
//         });
//         webPush.sendNotification(subscription, payload).catch((err: any) => console.error(err));
//     } catch (e) {
//         console.log("error in sending notification for place order")
//     }
    
// }