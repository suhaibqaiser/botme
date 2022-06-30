import {
    getAreas,
    getAreaTables,
    getRestaurants,
    getActiveRestaurants,
    addRestaurant,
    updateRestaurant,
    getRestaurantById,
    deleteRestaurants,
    getMaxLabelValue, getRestaurantId
} from "./service"
import {restResponse} from "../../../utils/response"
import {randomUUID} from "crypto";


export async function areaTable(areaId: string) {
    let response = new restResponse()

    if (!areaId) {
        response.status = "error"
        response.payload = 'areaId is required';
        return response
    }

    let result = await getAreaTables(areaId)
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Tables not found"
        response.status = "error"
        return response
    }
}

export async function getAreaList() {
    let response = new restResponse()

    let result = await getAreas()
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Area not found"
        response.status = "error"
        return response
    }
}

export async function getAllRestaurants() {
    let response = new restResponse()

    let result = await getRestaurants()
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Restaurants not found"
        response.status = "error"
        return response
    }
}

export async function getRestaurantsByLabel(restaurantLabel: any) {
    let response = new restResponse()

    let result = await getRestaurantById(restaurantLabel)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Restaurant not found"
        response.status = "error"
        return response
    }
}

export async function getActivedRestaurants() {
    let response = new restResponse()
    console.log('yo bro')
    let result = await getActiveRestaurants()
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Restaurants not found"
        response.status = "error"
        return response
    }
}

export async function addRestaurants(restaurant: any) {
    let response = new restResponse()

    let val = await getMaxLabelValue()
    restaurant.restaurantLabel = val ? (val.restaurantLabel + 1) : 1
    let result = await addRestaurant(restaurant)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    }

    response.payload = "Cannot add new restaurant"
    response.status = "error"
    return response
}


export async function updateRestaurants(restaurant: any) {
    let response = new restResponse()

    let result = await updateRestaurant(restaurant)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Update failed"
        response.status = "error"
        return response
    }
}

export async function deleteRestaurant(restaurantId: any) {
    let response = new restResponse()

    let result = await deleteRestaurants(restaurantId)
    if (result) {
        console.log("Restaurant Deleted")
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "error in deleting restaurant"
        response.status = "error"
        return response
    }

}

export async function verifyRestaurantId(req: any, res: any) {
    let response = new restResponse()
    try {
        const filter = req.query
        if (!filter.restaurantId) {
            response.message = `Sorry this request is invalid to verify your restaurant!`
            response.status = "danger"
            return res.send(response)
        }

        let verify = await getRestaurantId(filter.restaurantId)
        verify = JSON.parse(JSON.stringify(verify))
        if (!verify) {
            response.message = `Sorry failed to verify your restaurant!`
            response.status = "danger"
            return res.send(response)
        }

        response.payload = verify.restaurantId
        response.message = `Successfully restaurant verified!`
        response.status = "success"
        return res.send(response)
    }catch (e) {
        response.payload = e
        response.status = "danger"
    }
}
