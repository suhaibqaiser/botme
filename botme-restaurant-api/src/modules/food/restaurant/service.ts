import { Area } from './models/area'
import { Restaurant } from "./models/restaurant";

export async function getRestaurant(restaurantId: string) {
    return Restaurant.findOne({ restaurantId: restaurantId }, { _id: 0, __v: 0 });
}

export async function getRestaurants() {
    return Restaurant.find({}, { _id: 0, __v: 0 });
}

export function updateRestaurant(restaurant: any) {
    Restaurant.findOneAndUpdate({ restaurantId: restaurant.restaurantId }, restaurant)
}

export async function getAreas() {
    return Area.find({});
}

export async function getAreaTables(areaId: string) {
    return Area.find({ areaId: areaId }, { _id: 0, __v: 0, "tables.area": 0 }).populate("tables", { "area": 0, _id: 0 });
}
