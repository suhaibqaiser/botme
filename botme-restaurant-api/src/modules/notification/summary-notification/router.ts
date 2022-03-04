import {Request, Response} from "express";
import { SummaryNotification } from "./controller";
import { GetAllSubscription } from "../order-notification/service";


export default [
    {
        path: "/summary",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            let subscription = await GetAllSubscription()
            console.log("sending notification")
            console.log(subscription)
            for (let val of subscription){
                console.log("Result==>",val)
                let result = await SummaryNotification(val)
        }
        }
    }
]
