import {Reservation} from "./model";

export async function createReservation(reservation: any) {
    return Reservation.create(reservation)
}