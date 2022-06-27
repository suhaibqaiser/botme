import {restResponse} from "../../../utils/response";
import {
    createCart,
    createOrder, deleteCart,
    getCart,
    getCartById,
    getOrder,
    getOrderById,
    queryOrder,
    updateCart,
    updateOrder,
    updateCartStatus,
    updateOrderType, updateOrderStatusDB,
    deleteOrderByOrderLabel,
    deleteCartByOrderLabel,
    getCustomerId,
} from "./service";
import {randomUUID} from "crypto";
import { type } from "os";
import { sendingPlaceOrderNotification } from "../../../utils/helpers";


export async function findOrder(filter: any) {
    let response = new restResponse()

    if (filter && !filter.orderStatus) {
        delete filter.orderStatus
    }

    let result = await getOrder(filter)
    if (result.length != 0) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "order not found"
        response.status = "danger"
        return response
    }
}

export async function addOrder(order: any, restaurantId: any) {
    let response = new restResponse()
    if (!order || !restaurantId) {
        response.payload = "order and restaurantId is required"
        response.status = "danger"
        return response;
    }

    order.orderLabel = Math.random().toString(36).slice(2)
    order.restaurantId = restaurantId

    let result = await createOrder(order)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "order not found"
        response.status = "danger"
        return response
    }
}

export async function editOrder(order: any, restaurantId: any) {
    let response = new restResponse()
    if (!order || !restaurantId) {
        response.payload = "order and restaurantId is required"
        response.status = "danger"
        return response;
    }

    let result = await updateOrder(order, restaurantId)
    if (result) {
        await orderStatusNotification(order)
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "order not found"
        response.status = "danger"
        return response
    }
}

export async function orderStatusNotification(order:any) {

    if (order.orderStatus == "delivered"){
        await sendingPlaceOrderNotification(order.clientID,"Dear Customer","Your order has been delivered with order id: " + order.orderLabel + " ,Thanks!")

    } else if (order.orderStatus == "cancel") {
        await sendingPlaceOrderNotification(order.clientID,"Dear Customer","Your order has been cancelled, Thanks!")
    }
}

export async function searchOrder(filter:any) {
    let response = new restResponse()
    try {
        for (const filt in filter){
            if (filter[filt] == 'undefined' || filter[filt] == "" || filter[filt] == "all"){
                delete filter[filt]
            }
        }
        if(filter.orderTimestamp){
            let fromDate=new Date(filter.orderTimestamp)
            let toDate = new Date(filter.orderTimestamp)
            toDate.setDate(toDate.getDate() + 1)
            console.log(toDate)
            filter.orderTimestamp = {$gte: fromDate,$lt: toDate}

        }

        console.log("filter==>",filter)
        let orderlist :any[] = []
        if (filter.customerName) {
            // console.log("here")
            let result = await getCustomerId(filter.customerName)
            delete filter.customerName
            console.log(result)
            if (result.length != 0) {
                for (const res of result){
                    // console.log(res)
                    filter.customerId = res.customerId
                    console.log("getting order")
                    let data = await queryOrder(filter)
                    data.forEach((order: any) => {
                        if (!orderlist.includes(order)) {orderlist.push(order)}
                    })
                }
                response.payload = orderlist.sort(function(a:any,b:any){
                    // @ts-ignore
                    return new Date(b.orderTimestamp) - new Date(a.orderTimestamp);
                });
                response.status = "success"
                return response
                    // if (data) {
                    //     response.payload = data
                    //     response.status = "success"
                    //     return response
                    // } else {
                    //     response.payload = "order not found"
                    //     response.status = "danger"
                    //     return response
                    // }
            }
            response.payload = "order not found"
            response.status = "danger"
            return response

        } else {
            let result = await queryOrder(filter)
            console.log("result ==>",result)
            if (result) {
                response.payload = result
                response.status = "success"
                return response
            } else {
                response.payload = "order not found"
                response.status = "danger"
                return response
            }
        }
    } catch (e) {
            response.payload = "order not found"
            response.status = "danger"
            return response
    }
}
// CART //

export async function findCart(filter: any) {
    let response = new restResponse()
    try {

        if(filter.clientType === 'bot'){
            delete filter.clientType
            delete filter.clientID
        }

        delete filter.clientType
        let orderResult: any = await getOrderById(filter)
        orderResult = JSON.parse(JSON.stringify(orderResult))
        delete filter.clientID
        if (!orderResult) {
            response.message = 'Order not found.'
            response.status = "danger"
            return response
        }

        // if (orderResult && orderResult.orderStatus !== 'notified') {
        //     response.message = 'Only notified status order are allowed to search.'
        //     response.status = "danger"
        //     return response
        // }

        // filter orderLabel
        delete filter.orderType
        filter.orderLabel = orderResult.orderLabel
        let result = await getCart(filter)
        if (result && result.length) {
            response.payload = {
                order: orderResult,
                cart: result
            }
            response.status = "success"
            response.message = "Order found."
            return response
        } else {
            response.message = "Cart not found."
            response.status = "danger"
            return response
        }
    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}

export async function findCartById(filter: any, restaurantId: any) {
    let response = new restResponse()
    filter.restaurantId = restaurantId

    // filter orderLabel & restaurantId & cartId

    let result = await getCartById(filter)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found against restaurantId=" + filter.cartLabel + ' --- =' + filter.cartLabel
        response.status = "danger"
        return response
    }
}


export async function findCartByRestaurantId(filter: any) {
    let response = new restResponse()

    // filter orderLabel & restaurantId & cartId

    let result = await getCart(filter)
    if (result) {
        response.payload = result
        response.status = "success"
        return response
    } else {
        response.payload = "Cart not found against restaurantId=" + filter.cartLabel + ' --- =' + filter.cartLabel
        response.status = "danger"
        return response
    }
}

export async function addCart(obj: any, filter: any) {
    let response = new restResponse()
    try {
        if (!obj || !filter.restaurantId) {
            response.message = "cart and restaurantId is required"
            response.status = "danger"
            return response;
        }

        let cartObj = obj.cart
        let orderObj = obj.order
        let tempFilter = JSON.parse(JSON.stringify(filter))


        // checking is order exists
        // filter restaurantId & orderLabel
        let isOrderExists: any = await getOrderById(tempFilter)
        console.log(isOrderExists)
        if (isOrderExists) {
            console.log('yes fond')
            cartObj.forEach((item: any) => {
                item.cartId = (item.cartId && item.cartId.length) ? item.cartId : randomUUID()
                item.orderLabel = isOrderExists.orderLabel
            })

            // once order created just save cart only
            let cartResult = await createCart(cartObj)
            response.payload = {cart: cartResult, order: isOrderExists}
            response.status = "success"
            response.message = "Item added to cart."
            return response
        }


        // when creating first time order and cart
        orderObj.orderLabel = Math.random().toString(36).slice(2)
        let orderResult = await createOrder(orderObj)
        if (orderResult) {
            orderResult = JSON.parse(JSON.stringify(orderResult))
            cartObj.forEach((item: any) => {
                item.cartId = randomUUID()
                item.orderLabel = orderResult.orderLabel
            })

            let cartResult = await createCart(cartObj)
            if (cartResult) {
                cartResult = JSON.parse(JSON.stringify(cartResult))
                response.payload = {order: orderResult, cart: cartResult}
                response.status = "success"
                response.message = 'Item added to cart.'
                return response
            } else {
                response.message = "Failed add to cart."
                response.status = "danger"
                return response
            }
        } else {
            response.message = "Failed to place order."
            response.status = "danger"
            return response
        }
    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}

export async function editCart(cart: any, filter: any) {
    let response = new restResponse()
    try {
        if (!cart || !filter.restaurantId) {
            response.message = "cart and restaurantId is required"
            response.status = "danger"
            return response;
        }

        // filter restaurantId & cartId & orderLabel

        let result = await updateCart(cart, filter)
        console.log("update order")
        if (result) {
            response.payload = {cart: JSON.parse(JSON.stringify(result))}
            response.message = "Cart updated."
            response.status = "success"
            return response
        }
        response.message = "Cart not found."
        response.status = "danger"
        return response
    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }

}

export async function deleteCartById(filter: any) {
    let response = new restResponse()

    // filter restaurantId & cartId & orderLabel
    try {
        let result = await deleteCart(filter)
        if (result) {
            response.payload = result
            response.message = "Cart item deleted."
            response.status = "success"
            return response
        }
        response.message = "Cart not found."
        response.status = "danger"
        return response

    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}

export async function updateOrderStatus(filter: any, body: any) {
    let response = new restResponse()
    try {

        const orderType = JSON.parse(JSON.stringify(body.orderType))

        let orderResult = await updateOrderType(filter, orderType)
        if (!orderResult) {
            response.message = 'Failed to update order type.'
            response.status = "error"
            return response
        }

        let orderStatusResult = await updateOrderStatusDB(filter, body.orderStatus)
        if (!orderStatusResult) {
            response.message = 'Failed to update order status.'
            response.status = "error"
            return response
        }


        response.message = 'Your order placed successfully.'
        response.status = "success"
        return response
    } catch (e: any) {
        response.message = e.message
        response.status = "error"
        return response
    }
}

export async function deleteOrder(filter: any) {
    let response = new restResponse()

    // filter restaurantId & cartId & orderLabel
    try {
        let result = await deleteOrderByOrderLabel(filter)
        let cartResult = await deleteCartByOrderLabel(filter)
        if (result || cartResult) {
            response.payload = result
            response.message = "Deleted Successfully."
            response.status = "success"
            return response
        }
        response.message = "Order not found."
        response.status = "danger"
        return response

    } catch (e: any) {
        response.message = e.message
        response.status = "danger"
        return response
    }
}
