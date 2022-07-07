import {Request, Response} from "express";
import { SummaryNotification}  from "./controller";
import { GetAllSubscription } from "../order-notification/service";
import { type } from "os";
import { setTimeout } from "timers";
import { computeOrderSummaryNotification } from "../../../utils/helpers";


export default [
    {
        path: "/time",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            await SummaryNotification(req.query.restaurantId)
            setInterval(() => {SummaryNotification(req.query.restaurantId)}, 1800000);

            
            // let result = await setTimeSummary(time)
        }
    }
]
