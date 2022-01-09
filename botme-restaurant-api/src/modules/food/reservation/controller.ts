import { restResponse } from "../../../utils/response";
import { createReservation, getReservation, updateReservation, getAllReservation } from "./service";
import { getMaxLabelValue } from "../../food/reservation/service";
import { randomBytes } from "crypto";

export async function addReservation(reservation: any) {
    let response = new restResponse()
    console.log(reservation)
    if (!reservation) {
        response.payload = "reservation is required"
        response.status = "error"
        return response;
    }
    reservation.reservationId = randomBytes(3).toString('hex');
    let val = await getMaxLabelValue()
    reservation.reservationLabel = val ? (val.reservationLabel + 1) : 1

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
