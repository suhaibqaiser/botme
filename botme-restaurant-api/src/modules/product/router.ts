import {Request, Response} from "express";
import {addProduct} from "./controller";


export default [
    {
        path: "/product/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addProduct(req.body.product)
            res.send(result);
        }
    }
]