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
            await SummaryNotification(req.query.restuarantId)
            

            
            // let result = await setTimeSummary(time)
        }
    }
]
