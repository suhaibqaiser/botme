import { Area } from './models/area'
import { Restaurant } from "./models/restaurant";

export async function getRestaurant(restaurantId: string) {
    return Restaurant.findOne({ restaurantId: restaurantId }, { _id: 0, __v: 0 });
}

export async function getRestaurants() {
    return Restaurant.find({}, { _id: 0, __v: 0 });
}

export async function getRestaurantById(restaurantLabel: string) {
    return Restaurant.findOne({ restaurantLabel: restaurantLabel }, { _id: 0, __v: 0 });
}

export async function getActiveRestaurants() {
    return Restaurant.find({ restaurantActive: true }, { _id: 0, __v: 0 });
}

export function addRestaurant(restaurant: any) {
    return Restaurant.create(restaurant);
}

export function updateRestaurant(restaurant: any) {
    return Restaurant.findOneAndUpdate({ restaurantId: restaurant.restaurantId }, restaurant, { new: true });
}

export function deleteRestaurants(restaurantId: any) {
    return Restaurant.findOneAndDelete({restaurantId:restaurantId})

}

export async function getAreas() {
    return Area.find({}, { _id: 0, __v: 0 });
}

export async function getAreaTables(areaId: string) {
    return Area.find({ areaId: areaId }, { _id: 0, __v: 0, "tables.area": 0 }).populate("tables", { "area": 0, _id: 0 });
}

export async function getMaxLabelValue() {
    return Restaurant.findOne({}).sort({ restaurantLabel: -1 })
}
