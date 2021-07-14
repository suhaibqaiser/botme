export interface Reservation {
  reservationMeta: {
    customerArrival:String,
    customerSeated:String,
    customerDeparture:String
  },
  _id: String,
  reservationSeats: Number,
  reservationDatetime: String,
  reservationType: String,
  reservationSource: String,
  createdAt: String,
  updatedAt: String,
  __v: String,
  reservationId: String,
  customer: {
    _id: String,
    customerId: String,
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    customerActive: String,
    createdAt: String,
    updatedAt: String,
    __v: String
  },
  table:{
    _id: String,
    tableId: String,
    tableSeats: String,
    tableOccupied: String,
    area: String,
    customerActive: String,
    createdAt: String,
    updatedAt: String,
    __v: String
  }
  contextData: {}
}
