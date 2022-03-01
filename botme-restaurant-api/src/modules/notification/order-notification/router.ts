import {Request, Response} from "express";
import {GetSubscription, SendNotification} from "./controller";
import {deleteAllSubscription} from "./service";
import {GetAllSubscription} from "./service";


export default [
    {
        path: "/subscribe",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            console.log(req.body.endpoint)
            if (req.body.endpoint == "remove") {
                return
                // await deleteAllSubscription()
            } else {
                let result = await GetSubscription(req.body)
                res.send(result);
            }
        }
    },
    {
        path: "/send",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            let subscription = await GetAllSubscription()
            console.log("sending notification")
            console.log(subscription)
            for (let val of subscription){
                console.log("Result==>",val)
                let result = await SendNotification(req.body,val)
        }
        }
    }
]
