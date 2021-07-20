export interface Reservation {
  reservationMeta: {
    customerArrival: String,
    customerSeated: String,
    customerDeparture: String,
    customerWaiting: String
  },
  reservationSeats: Number | null,
  reservationDatetime: String,
  reservationType: String,
  reservationSource: String,
  reservationId: String,
  customer: String,
  table: String
}



// export class Reservation {
//   reservationMeta?: {
//     customerArrival?: String
//     customerSeated?: String
//     customerDeparture?: String
//   };
//   _id?: String;
//   reservationSeats?: Number;
//   reservationDatetime?: String;
//   reservationType?: String;
//   reservationSource?: String;
//   reservationId?: String;
//   customer?: String;
//   table?: String;

// }
