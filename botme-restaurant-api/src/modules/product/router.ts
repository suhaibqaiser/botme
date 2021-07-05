import {Request, Response} from "express";
import {addProduct, findProduct} from "./controller";


export default [
    {
        path: "/product/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addProduct(req.body.product)
            res.send(result);
        }
    },

    {
        path: "/product/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findProduct(req.query)
            res.send(result);
            //res.send(req.query)
        }
    }
]