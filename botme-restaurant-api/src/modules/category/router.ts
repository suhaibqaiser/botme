import {Request, Response} from "express";
import {addCategory} from "./controller";


export default [
    {
        path: "/category/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addCategory(req.body.category)
            res.send(result);
        }
    }
]