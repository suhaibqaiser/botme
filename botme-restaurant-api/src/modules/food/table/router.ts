import { Request, Response } from "express";
import {
    getAllTable,
    updateOneTable,
    addTable, findTable
} from "./controller"

export default [
    {
        path: "/tables",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAllTable(req.query.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/tables/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findTable(req.query, req.query.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/tables/update",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await updateOneTable(req.body.table, req.body.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/tables/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addTable(req.body.table, req.body.restaurantId)
            res.send(result);
        }
    }
];