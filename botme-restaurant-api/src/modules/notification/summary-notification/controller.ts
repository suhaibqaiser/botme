import { deleteSubscription, GetAllSubscription } from "../order-notification/service";

// const express = require('express'); 
const webPush = require('web-push');

const publicKey = 'BASpDNILoNMWYHhzrhEY6QKqFZqH8FOtybXu_3fqVk1lxbWNYU1VAmigQuN2u8lahgGOiW-FGHrWmrDwpbQ1-l0';
const privateKey = 'PhOBfVwSvRnXMzqSyuL4FZtUWTS3p8sMwH0GehRScTw';


export async function SummaryNotification(restuarantId:any) {
    webPush.setVapidDetails('mailto:tahahasan1997@gmail.com', publicKey,privateKey);

    let subscription = await GetAllSubscription(restuarantId)
        for (let val of subscription){
            if (val.notificationType == "Summary"){
                const subscription = val.subscription;
                const payload = JSON.stringify({
                    title: 'Order Summary'
                })
            
                webPush.sendNotification(subscription,payload).catch((err:any) => {
                    console.error(err)
                    if (err.body == "push subscription has unsubscribed or expired.\n") {
                        deleteSubscription(err.endpoint)
                        console.log("expired subscription deleted successfully")
                    }
                    });
                setTimeout(() => {SummaryNotification(restuarantId)}, 20000);
            }
            
        }
}
