import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  orderTypes: any = {
    dine_in: 'dine_in',
    pick_up: 'pick_up',
    delivery: 'delivery'
  }

  orderText: any = {
    dine_in: 'Reservation Label',
    pick_up: 'Order Id',
    delivery: 'Order Id'
  }

  orderStatusObject: any = {
    hold: 'hold',
    priced: 'priced',
    ready: 'ready',
    in_process: 'in_process',
    received: 'received',
    notified: 'notified',
    delivered: 'delivered',
    remade: 'remade',
    returned: 'returned'
  }

  orderStatusColors: any = {
    hold: 'badge bg-warning text-dark',
    priced: 'badge bg-success text-white',
    ready: 'badge bg-info text-dark',
    in_process: 'badge in_process',
    received: 'badge bg-success text-dark',
    notified: 'badge bg-info text-dark',
    delivered: 'badge bg-success text-white',
    remade: 'badge bg-danger text-white',
    returned: 'badge bg-danger text-white'
  }

  orderMessages: any = {
    hold: 'Customer hold items in cart!',
    priced: 'badge bg-success',
    ready: 'badge bg-info text-dark',
    in_process: 'badge in_process',
    received: 'badge bg-success',
    notified: 'Customer has booked his order!',
    delivered: 'badge bg-success',
    remade: 'badge bg-danger',
    returned: 'badge bg-danger'
  }

  constructor() {
  }

  computeOrderType(type = '') {
    const orderType = this.orderTypes[type]
    return {
      orderType: orderType ? orderType : '',
      orderText: this.orderText[orderType ? orderType : '']
    }
  }

  computeOrderStatusColor(type = '') {
    return this.orderStatusColors[type] ? this.orderStatusColors[type] : 'bg-light text-dark'
  }

  computeOrderMessages(type = '') {
    return this.orderMessages[type] ? this.orderMessages[type] : ''
  }

  computeDate(date = '') {
    let d = date.split('T')[0].split('-')
    return d[0] + '/' + d[1] + '/' + d[2]
  }

  computeTime(date = '') {

  }

  computeProduct(productList: any, id: any) {
    return productList.find((item: any) => item.productId === id)
  }

  getProductById(productList: any, id: any) {
    return productList.find((item: any) => item.productId === id)
  }

  computeProductsForOrderCart(type = '', list: any = [], productList: any = []) {
    let data = ''
    if (['options', 'ingredients'].includes(type)) {
      data = list.map((item: any) => {
        return this.getProductById(productList, item.productId).productName
      })
      return data
    }
    data = list.map((item: any) => {
      const product = this.getProductById(productList, item.productId)
      return product.productName + '(' + item.productQuantity + ')'
    })
    return data
  }

  customizeBillCalculation(order: any) {
    let price = this.roundToTwo(order.productPrice * order.productQuantity)

    if (order.productToppings && order.productToppings.length) {
      order.productToppings.forEach((item: any) => {
        price += item.productTotalPrice
      })
    }

    if (order.productAddons && order.productAddons.length) {
      order.productAddons.forEach((item: any) => {
        price += item.productTotalPrice
      })
    }
    price = this.roundToTwo(order.productTotalPrice)
    return price
  }

  roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  calculateProductRate(productRate: any) {
    let p: any
    ['standard', 'medium', 'large', 'small'].forEach((item: any) => {
      if (productRate[item] >= 1) {
        p = productRate[item]
      }
    })
    return p
  }
}
