import {Request, Response} from "express";
import {DoSubscription, OrderNotification,testNotification} from "./controller";
import {deleteAllSubscription} from "./service";
import {GetAllSubscription,deleteSubscription} from "./service";

export default [
    {
        path: "/subscribe",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            // if (req.body.endpoint == "remove") {
            //     return
            //     // await deleteAllSubscription()
            // } else {
            let result = await DoSubscription(req.body)
            // }
        }
    },
    {
        path: "/unsubscribe",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            let result = await deleteSubscription(req.body)
            console.log("subscription deleted")
        }
    },
    {
        path: "/send",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            let subscription = await GetAllSubscription()
            for (let val of subscription){
                console.log("Result==>",val)
                if (val.notificationType == "Order"){
                    let result = await OrderNotification(req.body,val.subscription)
                }
            }
        }
    },
    {
        path: "/test",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            let subscription = await GetAllSubscription()
            for (let val of subscription){
                let result = await testNotification(val)
            }
        }
        
    }
]
