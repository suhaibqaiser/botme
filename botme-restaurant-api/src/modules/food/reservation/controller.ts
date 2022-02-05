import {restResponse} from "../../../utils/response";
import {createReservation, getReservation, updateReservation, getAllReservation} from "./service";
import {getMaxLabelValue} from "../../food/reservation/service";
import {randomUUID} from "crypto";

export async function addReservation(reservation: any, restaurantId: any) {
    let response = new restResponse()

    if (!restaurantId) {
        response.message = "reservationId and restaurantId is required"
        response.status = "danger"
        return response;
    }
    reservation.reservationId = randomUUID();
    reservation.restaurantId = restaurantId
    // let val = await getMaxLabelValue()
    reservation.reservationLabel = Math.random().toString(36).slice(2)

    let result = await createReservation(reservation)
    if (result) {
        response.payload = JSON.parse(JSON.stringify(result))
        response.status = "success"
        response.message = "Your reservation has been placed."
        return response
    } else {
        response.message = "Failed to add your reservation."
        response.status = "danger"
        return response
    }
}


export async function editReservation(reservation: any, restaurantId: any) {
    let response = new restResponse()
    if (!reservation || !restaurantId) {
        response.payload = "reservation is required"
        response.status = "error"
        return response;
    }

    let result = await updateReservation(reservation, restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "reservation not found"
        response.status = "error"
        return response
    }
}


export async function findReservation(reservationId: any, restaurantId: any) {
    let response = new restResponse()
    if (!reservationId || !restaurantId) {
        response.payload = "reservationId and restaurantId is required"
        response.status = "error"
        return response;
    }

    let result = await getReservation(reservationId, restaurantId)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "reservation not found"
        response.status = "error"
        return response
    }
}

export async function findReservations(restaurantId: any) {
    let response = new restResponse()
    let result = await getAllReservation(restaurantId)
    if (result.length) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "reservation not found"
        response.status = "error"
        return response
    }
}
