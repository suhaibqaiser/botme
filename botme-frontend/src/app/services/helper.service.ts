import { splitAtColon } from '@angular/compiler/src/util';
import {Injectable, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { Key } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  timer: any
  orderTypes: any = {
    dine_in: 'dine_in',
    pick_up: 'pick_up',
    delivery: 'delivery'
  }

  orderText: any = {
    dine_in: 'Order Id',
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
    returned: 'returned',
    cancel: 'cancel',
    delete: 'delete',
    pending: 'pending'
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
    returned: 'badge bg-danger text-white',
    delete: 'badge bg-danger text-white',
    cancel: 'badge bg-warning text-dark',
    pending: 'badge badge-secondary text-white'
  }

  orderMessages: any = {
    hold: 'Customer hold items in cart!',
    priced: '',
    ready: '',
    in_process: '',
    received: '',
    notified: 'Customer has booked his order!',
    delivered: 'Order delivered',
    remade: '',
    returned: '',
    cancel: 'Order canceled temporarily.',
    delete: 'Delete order permanently.',
    pending: 'Items in cart waiting for checkout.'
  }





  constructor() {}

  
  /**
   * getting the values from localStorage
   * @param key
   */
   getLocalStorageByKey(key: any = '') {
    return localStorage.getItem(key)
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
    return d[2] + '-' + d[1] + '-' + d[0] 
  }

 
  computeTime(time = '') {
    // let dates= new Date()
    // return dates.toLocaleString()
    //dates = dates.split(' ').slice(0, 4).join(' ');
    return new Date(time).toLocaleDateString() + ' - ' + new Date(time).toLocaleTimeString() 
   
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

  


  timeAgo(time: any) {

    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    return time;
  }

}
