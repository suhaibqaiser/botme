import {restResponse} from "../../../utils/response";
import {createReservation, getReservation, updateReservation, getAllReservation} from "./service";
import {getMaxLabelValue} from "../../food/reservation/service";
import {randomUUID} from "crypto";

export async function addReservation(reservation: any, restaurantId: any) {
    let response = new restResponse()

    if (!restaurantId) {
        response.payload = "reservation and restaurantId is required"
        response.status = "error"
        return response;
    }
    reservation.reservationId = randomUUID();
    reservation.restaurantId = restaurantId
    let val = await getMaxLabelValue()
    reservation.reservationLabel = val ? (val.reservationLabel + 1) : 1

    let result = await createReservation(reservation)
    if (result) {
        const payload = JSON.parse(JSON.stringify(result))
        payload.orderId = randomUUID()
        response.payload = payload
        response.status = "success"
        return response
    } else {
        response.payload = "Reservation not found"
        response.status = "error"
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


export async function findReservation(reservationId: string, restaurantId: any) {
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
