import { Reservation } from "./model";

export async function createReservation(reservation: any) {
    return Reservation.create(reservation)
}

export async function updateReservation(reservation: any, restaurantId: string) {
    return Reservation.findOneAndUpdate({ reservationId: reservation.reservationId, restaurantId: restaurantId },
        reservation, { new: true })
}

export async function getReservation(reservationId: string, restaurantId: string) {
    return Reservation.findOne({ reservationId: reservationId, restaurantId: restaurantId })
}

export async function getAllReservation(restaurantId: string) {
    return Reservation.find({ restaurantId: restaurantId }).populate("customer").populate("table")
}

export async function getMaxLabelValue(restaurantId: string) {
    return Reservation.findOne({ restaurantId: restaurantId }).sort({ reservationLabel: -1 })
}
