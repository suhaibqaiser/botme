import { Request, Response } from "express";
import { areaTable, getAllRestaurants, getAreaList } from "./controller"

export default [
    {
        path: "/restaurant",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAllRestaurants()
            res.send(result);
        }
    },
    {
        path: "/restaurant/area",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await areaTable(req.query.areaId as string)
            res.send(result);
        }
    },
    {
        path: "/restaurant/getAreaList",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAreaList()
            res.send(result);
        }
    }
];
