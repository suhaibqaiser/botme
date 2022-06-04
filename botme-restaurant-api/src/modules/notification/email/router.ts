import {Request, Response} from "express";
import { sendOrderMail } from "./controller";

export default [
    {
        path: "/sendEmail",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            // if (req.body.endpoint == "remove") {
            //     return
            //     // await deleteAllSubscription()
            // } else {
            let result = await sendOrderMail(req.body)
            // }
        }
    }
]