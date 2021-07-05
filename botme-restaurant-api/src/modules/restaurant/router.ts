import {Request, Response} from "express";
import {
    areaTable
} from "./controller"

export default [
    {
        path: "/restaurant",
        method: "get",
        handler: async (req: Request, res: Response) => {
            res.send("Restaurant");
        }
    },
    {
        path: "/restaurant/area",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await areaTable(req.query.areaId as string)
            res.send(result);
        }
    }
];