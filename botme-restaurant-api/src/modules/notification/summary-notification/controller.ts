// const express = require('express'); 
const webPush = require('web-push');

const publicKey = 'BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA';
const privateKey = 'pRbJS-tqaGe3RkWBB29rZXFmZP1EaAw3XanPO6ZvEY4';

export async function summaryNotification(req:any) {

    webPush.setVapidDetails('mailto:tahahasan1997@gmail.com', publicKey,privateKey);


    // const express = require('express'); 
    // const webPush = require('web-push');
    // const bodyParser = require('body-parser');
    // const path = require('path');
    // const cors = require('cors');
    const subscription = req;

    const payload = JSON.stringify({title: 'Order Summary'})

    webPush.sendNotification(subscription,payload).catch((err:any) => console.error(err));
}
