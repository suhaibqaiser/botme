import {Request, Response} from "express";
import {addReservation} from "./controller";

export default [
    {
        path: "/reservation/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addReservation(req.body.reservation)
            res.send(result);
        }
    }
]