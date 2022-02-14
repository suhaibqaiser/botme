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
    priced: 'badge bg-success',
    ready: 'badge bg-info text-dark',
    in_process: 'badge in_process',
    received: 'badge bg-success',
    notified: 'badge bg-info text-dark',
    delivered: 'badge bg-success',
    remade: 'badge bg-danger',
    returned: 'badge bg-danger'
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
    return orderType ? orderType : ''
  }

  computeOrderStatusColor(type = '') {
    return this.orderStatusColors[type] ? this.orderStatusColors[type] : 'bg-light text-dark'
  }

  computeOrderMessages(type = '') {
    return this.orderMessages[type] ? this.orderMessages[type] : ''
  }

  computeDate(date = '') {
    return new Date(date).getDate() + '/' + new Date(date).getMonth() + '/' + new Date(date).getFullYear()
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
    if (['options','ingredients'].includes(type)) {
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
}
