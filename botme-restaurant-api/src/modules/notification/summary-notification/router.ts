import {Request, Response} from "express";
import { SummaryNotification}  from "./controller";
import { GetAllSubscription } from "../order-notification/service";
import { type } from "os";
import { setTimeout } from "timers";


export default [
    {
        path: "/time",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            console.log("setting time")
            console.log(req.body.req)
            let time1 =  parseFloat(req.body.req)
            let time2 = time1*3600
            let time = time2*1000
            console.log(time)
            await SummaryNotification(time)
            

            
            // let result = await setTimeSummary(time)
        }
    }
]
