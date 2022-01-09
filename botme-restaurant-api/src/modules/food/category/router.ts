import { Request, Response } from "express";
import { addCategory, editCategory, getAllCategory, removeCategory } from "./controller";


export default [
    {
        path: "/category/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addCategory(req.body.category, req.body.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/category/edit",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await editCategory(req.body.category, req.body.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/category/all",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAllCategory(req.query.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/category/remove",
        method: "delete",
        handler: async (req: Request, res: Response) => {
            let result = await removeCategory(req.query.categoryId, req.query.restaurantId)
            res.send(result);
        }
    }
]