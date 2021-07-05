import {Request, Response} from "express";
import {createCustomer, findCustomer, updateCustomer} from "./controller";

export default [
    {
        path: "/customer/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findCustomer(req.query)
            res.send(result);
        }
    },
    {
        path: "/customer/update",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await updateCustomer(req.body.customer)
            res.send(result);
        }
    },
    {
        path: "/customer/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await createCustomer(req.body.customer)
            res.send(result);
        }
    }
]