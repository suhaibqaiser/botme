import {restResponse} from "../../utils/response";
import {createReservation} from "./service";

export async function addReservation(reservation: any) {
    let response = new restResponse()
    if (!reservation) {
        response.payload = "reservation is required"
        response.status = "error"
        return response;
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