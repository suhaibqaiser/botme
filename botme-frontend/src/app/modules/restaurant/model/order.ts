export interface Order {
  restaurantId: '',
  orderLabel: '',
  reservationLabel: '',
  orderTimestamp: '', // datetime
  orderType: '',
  customerId: '',
  addressId: '',
  tableId: '',
  delivery: {
    deliveryDate: '', // datetime
    deliverFee: '',
    deliveryNote: '',
  },
  orderPaymentMethod: '',
  orderSubTotal: '',
  orderTip: '',
  orderDiscount: 0, // discount percent
  orderServiceTax: 0,
  orderSalesTax: 0,
  orderTotal: 0,
  orderStatus: false
}
