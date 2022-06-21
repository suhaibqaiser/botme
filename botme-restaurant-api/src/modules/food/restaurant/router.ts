import { Request, Response } from "express";
import { areaTable, getAllRestaurants, getAreaList, getActivedRestaurants, addRestaurants, updateRestaurants, getRestaurantsById, deleteRestaurant } from "./controller"

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
        path: "/restaurant/active-restaurant",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getActivedRestaurants()
            res.send(result);
        }
    },
    {
        path: "/restaurant/getbyid",
        method: "get",
        handler: async (req: Request, res: Response) => {
            let result = await getRestaurantsById(req.query.restaurantId)
            res.send(result);
        }
    },
    {
        path: "/restaurant/add",
        method: "put",
        handler: async (req: Request, res: Response) => {
            let result = await addRestaurants(req.body.restaurant)
            res.send(result);

        }
    },
    {
        path: "/restaurant/update",
        method: "post",
        handler: async (req: Request, res: Response) => {
            let result = await updateRestaurants(req.body.restaurant)
            res.send(result);
        }
    },
    {
        path: "/restaurant/delete",
        method: "delete",
        handler: async (req: Request, res: Response) => {
            let result = deleteRestaurant(req.query.restaurantId)
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
