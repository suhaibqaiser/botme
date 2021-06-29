import {Request, Response} from "express";
import {
    getAllTable,
    getUnoccupiedTables,
    getUnoccupiedTablesBySeats,
    updateOneTable,
    createTable
} from "./controller"

export default [
    {
        path: "/tables",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getAllTable()
            res.send(result);
        }
    },
    {
        path: "/tables/unoccupiedbyseats/",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getUnoccupiedTablesBySeats(Number(req.query.seats))
            res.send(result);
        }
    },
    {
        path: "/tables/unoccupied",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getUnoccupiedTables()
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
        path: "/tables/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await createTable(req.body.table)
            res.send(result);
        }
    }
];