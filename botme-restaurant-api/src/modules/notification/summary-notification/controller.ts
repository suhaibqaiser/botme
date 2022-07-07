import { computeOrderSummaryNotification } from "../../../utils/helpers";
import { deleteSubscription, GetAllSubscription } from "../order-notification/service";

// const express = require('express'); 
const webPush = require('web-push');

const publicKey = 'BASpDNILoNMWYHhzrhEY6QKqFZqH8FOtybXu_3fqVk1lxbWNYU1VAmigQuN2u8lahgGOiW-FGHrWmrDwpbQ1-l0';
const privateKey = 'PhOBfVwSvRnXMzqSyuL4FZtUWTS3p8sMwH0GehRScTw';


export async function SummaryNotification(restuarantId:any) {
    webPush.setVapidDetails('mailto:botme@123.com', publicKey,privateKey);


    let orderSummary = await computeOrderSummaryNotification(restuarantId)
    console.log("orderSummary==>",orderSummary)
    console.log("summary notification")

    let subscription = await GetAllSubscription(restuarantId)
    
        for (let val of subscription){
            if (val.notificationType == "Summary"){
                const subscription = val.subscription;
                const payload = JSON.stringify({
                    title: 'ORDER SUMMARY',
                    body: '\nOrderInProgress: '+orderSummary.orderInProgress+'\nOrderDelivered: '+orderSummary.orderdelivered+'\nOrderCanceled: '+orderSummary.orderCancel+'\nTotalEarning: '+orderSummary.totalEarning
                });
                webPush.sendNotification(subscription,payload).catch((err:any) => {
                    console.error(err)
                    if (err.body == "push subscription has unsubscribed or expired.\n") {
                        deleteSubscription(err.endpoint)
                        console.log("expired subscription deleted successfully")
                    }
                    });
            }
            
        }
}
