import { Request, Response } from "express";
import { processFile } from "./controller";


export default [
    {
        path: "/command-api/upload",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await processFile(req)
            res.send(result);
        }
    }
]