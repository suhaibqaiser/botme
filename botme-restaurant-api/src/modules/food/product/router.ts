import { Request, Response } from "express";
import { addProduct, editProduct, findProduct } from "./controller";


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
            let result = await findProduct(req.query)
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
    }
]