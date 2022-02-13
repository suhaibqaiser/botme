import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../service/order.service";
import {CustomerService} from "../../../service/customer.service";
import {ProductService} from "../../../service/product.service";
import {HelperService} from "../../../../../services/helper.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.css']
})
export class OrderOverviewComponent implements OnInit {

  orders: any = []
  customers: any
  loading = true
  carts: any = []
  products: any = []

  constructor(private _router: Router, public _helperService: HelperService, private _productService: ProductService, private _orderService: OrderService, private _customerService: CustomerService) {
  }

  async ngOnInit() {
    await this.getProducts()
  }

  async getOrders() {
    this._orderService.getOrders()
      .subscribe(result => {
        if (result.status === 'success') {
          this.orders = result.payload

          if (Array.isArray(this.orders)) {
            for (let order of this.orders) {
              order.carts = this.getCartByOrderLabel(order.orderLabel)
              order.customer = this.getCustomerName(order.customerId)
            }
          }
          console.log(this.orders)
        }
        this.loading = false
      });
    return true
  }

  async getCustomers() {
    this._customerService.getCustomers()
      .subscribe(result => {
        if ((result.status === 'success')) {
          this.customers = result.payload
          this.getCartDetails()
        }
      });
    return true
  }

  getCustomerName(customerId: string) {
    let customer = this.customers.find((customer: { customerId: string; }) => customer.customerId === customerId);
    if (customer) return customer
    return null;
  }

  async getCartDetails() {
    await this._orderService.getCartByRestaurantId().subscribe(
      result => {
        if ((result.status === 'success')) {
          this.carts = result.payload
          this.getOrders()
        }
        this.loading = false
      }
    )
    return true
  }

  getCartByOrderLabel(orderLabel: any) {
    let lists = this.carts.filter((item: any) => item.orderLabel === orderLabel)
    if (Array.isArray(lists)) {
      for (let item of lists) {
        const name = this.getProductById(item.productId) ? this.getProductById(item.productId) : null
        item.product = name
      }
    }
    return lists
  }

  async getProducts() {
    await this._productService.getProducts()
      .subscribe(result => {
        if (result.status === 'success') {
          this.products = result.payload
          this.getCustomers()
        }
      });
    return true
  }

  getProductById(id: any) {
    return this.products.find((item: any) => item.productId === id)
  }

  viewOrderDetail(order: any) {
    this._orderService.setOrderDetailObject(order)
    this._router.navigate(['/order-detail'])
  }
}
