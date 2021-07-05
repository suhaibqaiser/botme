import {Request, Response} from "express";
import {addMenu, findMenu} from "./controller";

export default [
    {
        path: "/menu/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addMenu(req.body.menu)
            res.send(result);
        }
    },
    {
        path: "/menu/search",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findMenu(req.query.menuId)
            res.send(result);
        }
    }
]