import {Request, Response} from "express";
import {
    addCart,
    addOrder,
    deleteCartById,
    editCart,
    editOrder,
    findCart,
    findCartByRestaurantId,
    findCartById,
    findOrder,
    updateOrderStatus,
    deleteOrder
} from "./controller";

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
            console.log("order ==>",req.body.order)
            let result = await editOrder(req.body.order, req.body.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/order/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addOrder(req.body.order, req.body.restaurantId)
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
        path: "/cart/findCartByRestaurantId",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findCartByRestaurantId(req.query)
            res.send(result);
        }
    },
    {
        path: "/cart/findCartById",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findCartById(req.query, req.query.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/cart/edit",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await editCart(req.body.cart, req.query)
            res.send(result);
        }
    },
    {
        path: "/cart/add",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await addCart(req.body, req.query)
            res.send(result);
        }
    },
    {
        path: "/cart/deleteById",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await deleteCartById(req.query)
            res.send(result);
        }
    },
    {
        path: "/cart/updateOrderStatus",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await updateOrderStatus(req.query, req.body)
            res.send(result);
        }
    },
    {
        path: "/order/deleteByOrderLabel",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await deleteOrder(req.query)
            res.send(result);
        }
    }
];
