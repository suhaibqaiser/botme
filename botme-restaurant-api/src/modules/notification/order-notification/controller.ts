import { AddSubscription, FindSubscription} from "./service";
import { GetAllSubscription } from "./service";

// const express = require('express'); 
const webPush = require('web-push');

const publicKey = 'BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA';
const privateKey = 'pRbJS-tqaGe3RkWBB29rZXFmZP1EaAw3XanPO6ZvEY4';

export async function GetSubscription(req:any) {  

    let CheckIfExist = await FindSubscription(req)
    console.log(CheckIfExist.length)

    if (CheckIfExist.length != 0){
        console.log("already exist") 
    }
    else{
        let result = await AddSubscription(req);

        if (result){
            console.log("subscribed to restuarant api")
        }
        else{
            console.log("error in subscription")
        }
    }
    // const subscription = req;

    // console.log(subscription)

    // const payload = JSON.stringify({title: 'New Order'})

    // webPush.sendNotification(subscription,payload).catch((err:any) => console.error(err));
}
export async function SendNotification(req:any) {

    webPush.setVapidDetails('mailto:tahahasan1997@gmail.com', publicKey,privateKey);

    const subscription = await GetAllSubscription();
    const payload = JSON.stringify({
        title: 'New Order',
        body: 'mister taha has place an order'
    });

    webPush.sendNotification(subscription,payload).catch((err:any) => console.error(err));
}
