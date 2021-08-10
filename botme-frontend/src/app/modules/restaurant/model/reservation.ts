export interface Reservation {
  // FIXME: update structure to new syntax standard
  reservationMeta: {
    customerArrival: String,
    customerSeated: String,
    customerDeparture: String,
    customerWaiting: String
  },
  reservationSeats: Number | null,
  reservationDatetime: Date,
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
