import { Request, Response } from "express";
import { orderNotification } from "./controller";

export default [
    {
        path: "/subscribe",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            console.log(req.body)
            let result = await orderNotification(req.body)
            // res.send(result);
        }
    }
]