import { Request, Response } from "express";
import { createCustomer, findCustomer, getAllCustomer, updateCustomer, getAddressByCustomerId } from "./controller";

export default [
    {
        path: "/customer/",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAllCustomer(req.query.restaurantId)
            res.send(result);
        }
    },
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
            let result = await updateCustomer(req.body, req.query)
            res.send(result);
        }
    },
    {
        path: "/customer/add",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await createCustomer(req.query,req.body)
            res.send(result);
        }
    },

    {
        path: "/address/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAddressByCustomerId(req.params.customerId, req.query.restaurantId)
            res.send(result);
        }
    }
]
