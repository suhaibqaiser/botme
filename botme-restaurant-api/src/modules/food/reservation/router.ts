import { Request, Response } from "express";
import { addReservation, editReservation, findReservation, findReservations } from "./controller";

export default [
    {
        path: "/reservation/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addReservation(req.body.reservation, req.body.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/reservation/edit",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await editReservation(req.body.reservation, req.body.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/reservation/find",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findReservation(String(req.query.reservationId), String(req.query.restaurantId))
            res.send(result);
        }
    },
    {
        path: "/reservation/findAll",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await findReservations(String(req.query.restaurantId))
            res.send(result);
        }
    }
]