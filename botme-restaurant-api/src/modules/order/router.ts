import {Request, Response} from "express";
import {addOrder, editOrder, findOrder} from "./controller";

export default [
    {
        path: "/orders/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findOrder(req.query)
            res.send(result);
        }
    },
    {
        path: "/orders/update",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await editOrder(req.body.order)
            res.send(result);
        }
    },
    {
        path: "/orders/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addOrder(req.body.order)
            res.send(result);
        }
    }
];