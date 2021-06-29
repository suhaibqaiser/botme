import {Request, Response} from "express";
import {createCustomer, getCustomerByID, updateCustomer} from "./controller";
import {getCustomerByPhone} from "./service";

export default [
    {
        path: "/customer/byid",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getCustomerByID(String(req.query.id))
            res.send(result);
        }
    },
    {
        path: "/customer/byphone",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getCustomerByPhone(String(req.query.phone))
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