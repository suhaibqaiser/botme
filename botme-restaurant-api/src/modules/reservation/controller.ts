import {restResponse} from "../../utils/response";
import {createReservation, getReservation, updateReservation} from "./service";

export async function addReservation(reservation: any) {
    let response = new restResponse()
    if (!reservation) {
        response.payload = "reservation is required"
        response.status = "error"
        return response;
    }
    reservation.reservationId = Math.floor(1000 + Math.random() * 9000);

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