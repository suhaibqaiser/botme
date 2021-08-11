import {restResponse} from "../../../utils/response";
import {createReservation, getReservation, updateReservation, getAllReservation} from "./service";
import {getMaxLabelValue} from "../../food/reservation/service";
import {randomUUID} from "crypto";
export async function addReservation(reservation: any) {
    let response = new restResponse()
    if (!reservation) {
        response.payload = "reservation is required"
        response.status = "error"
        return response;
    }
    reservation.reservationId = randomUUID();
    let val = await getMaxLabelValue()
    if (val.length > 0) {
        reservation.reservationLabel = val[0].reservationLabel + 1
    } else {
        reservation.reservationLabel = 0
    }

    let result = await createReservation(reservation)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Reservation not found"
        response.status = "error"
        return response
    }
}


export async function editReservation(reservation: any) {
    let response = new restResponse()
    if (!reservation) {
        response.payload = "reservation is required"
        response.status = "error"
        return response;
    }

    let result = await updateReservation(reservation)
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


export async function findReservation(reservationId: string) {
    let response = new restResponse()
    if (!reservationId) {
        response.payload = "reservationId is required"
        response.status = "error"
        return response;
    }

    let result = await getReservation(reservationId)
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

export async function findReservations() {
    let response = new restResponse()
    let result = await getAllReservation()
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
