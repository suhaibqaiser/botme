import {Request, Response} from "express";
import {GetSubscription, SendNotification} from "./controller";
import {deleteAllSubscription} from "./service";

export default [
    {
        path: "/subscribe",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            console.log(req.body.endpoint)
            if (req.body.endpoint == "remove") {
                await deleteAllSubscription()
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
            console.log("Result==>",req.body)
            let result = await SendNotification(req.body)
        }
    }
]
