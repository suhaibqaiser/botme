import {AddSubscription, FindSubscription,updateSubscription} from "./service";
import { GetAllSubscription } from "./service";


// const express = require('express');
const webPush = require('web-push');

const publicKey = 'BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA';
const privateKey = 'pRbJS-tqaGe3RkWBB29rZXFmZP1EaAw3XanPO6ZvEY4';

export async function DoSubscription(req: any) {

    let CheckIfExist = await FindSubscription(req)

    if (CheckIfExist.length != 0) {
        console.log("already exist")
        let result = await updateSubscription(req);
        console.log("subscription updated")
        
    } else {
        let result = await AddSubscription(req);

        if (result) {
            console.log("subscribed to restuarant api")
        } else {
            console.log("error in subscription")
        }
    }
    // const subscription = req;

    // console.log(subscription)

    // const payload = JSON.stringify({title: 'New Order'})

    // webPush.sendNotification(subscription,payload).catch((err:any) => console.error(err));
}

export async function OrderNotification(req: any,subscription:any) {

    webPush.setVapidDetails('mailto:tahahasan1997@gmail.com', publicKey, privateKey);

    // const subscription = await GetAllSubscription();
    const payload = JSON.stringify({
        title: 'New Order',
        body: 'Hi, Mister ' + req.customerName + ' has placed an order with order ID ' + req.orderId + ' with amount ' + req.total + ' and order type is ' + req.orderType + '. Thanks'
    });

    webPush.sendNotification(subscription, payload).catch((err: any) => console.error(err));
}

export async function testNotification(subscription:any) {

    webPush.setVapidDetails('mailto:tahahasan1997@gmail.com', publicKey, privateKey);
    
    // const subscription = await GetAllSubscription();

    const payload = JSON.stringify({
        title: 'Test Notification',
        body: 'This is Notification'
    });

    webPush.sendNotification(subscription, payload).catch((err: any) => console.error(err));
}
