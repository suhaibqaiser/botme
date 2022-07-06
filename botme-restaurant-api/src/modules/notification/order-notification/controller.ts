import {AddSubscription, checkIfSubscriptionExists, deleteSubscription,updateSubscription} from "./service";
import { GetAllSubscription } from "./service";


// const express = require('express');
const webPush = require('web-push');

const publicKey = 'BASpDNILoNMWYHhzrhEY6QKqFZqH8FOtybXu_3fqVk1lxbWNYU1VAmigQuN2u8lahgGOiW-FGHrWmrDwpbQ1-l0';
const privateKey = 'PhOBfVwSvRnXMzqSyuL4FZtUWTS3p8sMwH0GehRScTw';

export async function DoSubscription(req: any) {

    let CheckIfExist = await checkIfSubscriptionExists(req)

    if (CheckIfExist) {
        console.log("already exist")
        return CheckIfExist
    } else {
        let update = await updateSubscription(req);
        if (update){
            console.log("subscription updated")
            return update
        } else {
            console.log("cannot update subscription")
        }
    }

    let result = await AddSubscription(req);

    if (result) {
        console.log("subscribed to restuarant api")
        return null
    } else {
        console.log("error in subscription")
        return null
    }
}

export async function OrderNotification(req: any,subscription:any) {

    console.log("orderNotification")

    webPush.setVapidDetails('mailto:botme@123.com', publicKey, privateKey);

    const payload = JSON.stringify({
        title: 'New Order',
        body: 'Hi ' + req.customerName + ', your order has been placed with order ID ' + req.orderId + ' with amount ' + req.total + ' and order type is ' + req.orderType + '. Thanks'
    });

    webPush.sendNotification(subscription, payload).catch((err: any) => {
        console.error(err)
        if (err.body == "push subscription has unsubscribed or expired.\n") {
            deleteSubscription(err.endpoint)
            console.log("expired subscription deleted successfully")
        }
        });
}

export async function testNotification(subscription:any) {

    webPush.setVapidDetails('mailto:botme@123.com', publicKey, privateKey);
    
    // const subscription = await GetAllSubscription();

    const payload = JSON.stringify({
        title: 'Test Notification',
        body: 'This is Notification'
    });

    webPush.sendNotification(subscription, payload).catch((err: any) => {
    console.error("error==>",err)
    if (err.body == "push subscription has unsubscribed or expired.\n") {
        console.log("endpoints==>",err.endpoint)
        deleteSubscription(err.endpoint)
        console.log("expired subscription deleted successfully")
    }
    });
}   
