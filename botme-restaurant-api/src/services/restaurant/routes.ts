import {Request, Response} from "express";
import {
    getAllTable,
    getUnoccupiedTables,
    getUnoccupiedTablesBySeats,
    updateOneTable,
    areaTable,
    createTable
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
    },
    {
        path: "/restaurant/tables",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAllTable()
            res.send(result);
        }
    },
    {
        path: "/restaurant/tables/unoccupiedbyseats/",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getUnoccupiedTablesBySeats(Number(req.query.seats))
            res.send(result);
        }
    },
    {
        path: "/restaurant/tables/unoccupied",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getUnoccupiedTables()
            res.send(result);
        }
    },
    {
        path: "/restaurant/tables/update",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await updateOneTable(req.body.table)
            res.send(result);
        }
    },
    {
        path: "/restaurant/tables/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await createTable(req.body.table)
            res.send(result);
        }
    }
];