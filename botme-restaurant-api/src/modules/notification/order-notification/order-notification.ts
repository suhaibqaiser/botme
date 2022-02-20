const express = require('express'); 
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

export async function orderNotification() {
    // const express = require('express'); 
    // const webPush = require('web-push');
    // const bodyParser = require('body-parser');
    // const path = require('path');
    // const cors = require('cors');


    const app = express();

    app.use(bodyParser.json());
    app.use(cors())

    const publicKey = 'BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA';
    const privateKey = 'pRbJS-tqaGe3RkWBB29rZXFmZP1EaAw3XanPO6ZvEY4';

    webPush.setVapidDetails('mailto:tahahasan1997@gmail.com', publicKey,privateKey);

    app.post('/order/notification',(req:any,res:any) => {

        const subscription = req.body;

        res.status(201).json({});


        const payload = JSON.stringify({title: 'push test'})


        webPush.sendNotification(subscription,payload).catch((err:any) => console.error(err));
    });
}
