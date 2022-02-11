import { Request, Response } from "express";
import { addProduct, editProduct, findProduct, suggestProduct } from "./controller";


export default [
    {
        path: "/product/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addProduct(req.body.product, req.body.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/product/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findProduct(req.query, req.query.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/product/update",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await editProduct(req.body.product, req.body.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/product/suggest",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await suggestProduct(req.body.searchParameters, req.body.restaurantId)
            res.send(result);
        }
    }
]