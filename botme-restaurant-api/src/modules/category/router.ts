import {Request, Response} from "express";
import {addCategory, getAllCategory} from "./controller";


export default [
    {
        path: "/category/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addCategory(req.body.category)
            res.send(result);
        }
    },
    {
        path: "/category/all",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAllCategory()
            res.send(result);
        }
    }
]