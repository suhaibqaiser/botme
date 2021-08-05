export interface Order {
    restaurantId: string;
    orderId: string;
    orderLabel: string;
    orderTimestamp: Date; // datetime
    orderType: string;
    customerId: string;
    addressId: string;
    tableId: string;
    cartId: string;
    delivery: {
        deliveryDate: Date; // datetime
        deliverFee: number;
        deliveryNote: string;
    }
    orderPaymentMethod: string;
    orderSubTotal: number;
    orderTip: number;
    orderDiscount: number; // discount percent
    orderServiceTax: number;
    orderSalesTax: number;
    orderTotal: number;
}