import {Request, Response} from "express";
import {addCart, addOrder, editCart, editOrder, findCart, findOrder} from "./controller";

export default [
    {
        path: "/order/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findOrder(req.query)
            res.send(result);
        }
    },
    {
        path: "/order/update",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await editOrder(req.body.order)
            res.send(result);
        }
    },
    {
        path: "/order/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addOrder(req.body.order)
            res.send(result);
        }
    },
    {
        path: "/cart/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findCart(req.query)
            res.send(result);
        }
    },
    {
        path: "/cart/edit",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await editCart(req.body.cart)
            res.send(result);
        }
    },
    {
        path: "/cart/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addCart(req.body.cart)
            res.send(result);
        }
    }
];
