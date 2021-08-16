import {Request, Response} from "express";
import {addMenu, findMenu, getAllMenu} from "./controller";
import {updateOneTable} from "../table/controller";

export default [
    {
        path: "/menus",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAllMenu()
            res.send(result);
        }
    },
    {
        path: "/menus/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addMenu(req.body.menu)
            res.send(result);
        }
    },
    {
        path: "/tables/update",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await updateOneTable(req.body.table)
            res.send(result);
        }
    },
    {
        path: "/menus/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findMenu(req.query)
            res.send(result);
        }
    }
]
