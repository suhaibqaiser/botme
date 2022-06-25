import {Request, Response} from "express";
import { saveSubscription } from "./controller";


export default [
    {
        path: "/subscribe/save",
        method: "post",
        handler: async (req: Request, res: Response) => {
            res.status(201).json({});
            console.log(req.body)
            let result = await saveSubscription(req.body)
        }
    },
]