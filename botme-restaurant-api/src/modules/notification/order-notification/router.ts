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
            await DoSubscription(req.body)
        }
    },
    {
        path: "/send",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            let subscription = await GetAllSubscription(req.body.restaurantId)
            for (let val of subscription){
                if (val.notificationType == "Order"){
                    await OrderNotification(req.body,val.subscription)
                }
            }
        }
    },
    {
        path: "/test",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            let subscription = await GetAllSubscription(req.query.restaurantId)
            for (let val of subscription){
                await testNotification(val.subscription)
            }
        }
        
    }
]
