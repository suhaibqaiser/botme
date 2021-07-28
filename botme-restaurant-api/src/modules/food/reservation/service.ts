import {Reservation} from "./model";

export async function createReservation(reservation: any) {
    return Reservation.create(reservation)
}

export async function updateReservation(reservation: any) {
    return Reservation.findOneAndUpdate({reservationId: reservation.reservationId}, reservation, {new: true})
}

export async function getReservation(reservationId: string) {
    return Reservation.findOne({reservationId: reservationId})
}

export async function getAllReservation() {
    return Reservation.find({}).populate("customer").populate("table")
}