import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../service/order.service";
import {CustomerService} from "../../../service/customer.service";
import {ProductService} from "../../../service/product.service";
import {HelperService} from "../../../../../services/helper.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";


declare var $: any;

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.css']
})
export class OrderOverviewComponent implements OnInit {

  orders: any = []
  customers: any
  filteredCustomers:any
  loading = true
  carts: any = []
  products: any = []


  isLoading = false;
    //search text
    searchControl = new FormControl("")
    searchText = ''

    searchList: any


    payload: any = {
      customerName:''
    }

    queryParams: any = {
      customerName: ''
    }
  

  constructor(private messageService: MessageService,private _http: HttpClient, private _router: Router,private _route: ActivatedRoute, public _helperService: HelperService, private _productService: ProductService, private _orderService: OrderService, private _customerService: CustomerService) 
   {
    clearTimeout(this._helperService.timer)
  }


  async ngOnInit() {
    await this.getProducts()
    this.searchList = []
    this.isLoading = true
    await this.getQueryParams()
  }



  
  async getQueryParams() {
    this._route.queryParams.subscribe(param => {
      this.queryParams = {
        customerName: (param && param.customerName) ? param.customerName : '',
      }
      this.payload = this.queryParams
      this.searchControl.setValue(this.payload.customerName)
    })
  }

  async getOrders() {
    this.loading = true
    this._orderService.getOrders('notified')
      .subscribe(result => {
        this.loading = false
        if (result.status === 'success') {
          this.orders = result.payload

          if (Array.isArray(this.orders)) {
            for (let order of this.orders) {
              order.carts = this.getCartByOrderLabel(order.orderLabel)
              order.productTotalPrice = order.carts.reduce((prev: any, next: any) => {
                return prev + next.productTotalPrice
              }, 0)
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
    this.loading = true
    this._customerService.getCustomers()
      .subscribe(result => {
        this.loading = false
        if ((result.status === 'success')) {
          this.customers = result.payload
          this.getCartDetails()
        }
      });
    return true
  }

  filterCustomersByName(event: any = null) {
    let text = event && event.target.value ? event.target.value : ''
    this.searchControl.setValue(text)
    if (this.searchControl.value && this.searchControl.value.length) {
      this.setFilterList('Search', this.searchControl.value)
      this.payload.customerName = this.searchControl.value
      this.setQueryParameters()
    } else {
      this.payload.customerName = ''
      this.setQueryParameters()
      this.searchControl.setValue('')
    }
    console.log(this.searchControl.value);
    
    this._customerService.getCustomersByFiltering(this.searchControl.value).subscribe(
  
      ((res: any) => {
        this.filteredCustomers = res.status !== 'error' ? res.payload : []
        this.isLoading = false
      })      
    )
  }

  getCustomerName(customerId: string) {
    let customer = this.customers.find((customer: { customerId: string; }) => customer.customerId === customerId);
    if (customer) return customer
    return null;
  }

  async getCartDetails() {
    this.loading = true
    await this._orderService.getCartByRestaurantId().subscribe(
      result => {
        this.loading = false
        if ((result.status === 'success')) {
          this.carts = result.payload
          this.getOrders()
        }
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
    this.loading = true
    await this._productService.getProducts()
      .subscribe(result => {
        this.loading = false
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

  setQueryParameters() {    
    if (!this.payload.productName) this.payload.customerName = ''
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: this.payload,
      queryParamsHandling: 'merge',
    });
  }

  setFilterList(type: any, value: any) {
    let check = this.searchList.filter((item: any) => item.name == type)
    if (check[0]) {
      check[0].value = value
      localStorage.setItem('searchList', JSON.stringify(this.searchList))
      return
    }
    this.searchList.push({
      'name': type,
      'value': value
    })
    localStorage.setItem('searchList', JSON.stringify(this.searchList))
  }

  updateOrderStatus(order: any, orderStatus: any) {
    this._orderService.updateOrderStatus(order.orderLabel, order.orderType, orderStatus).subscribe((res: any) => {
      this.messageService.add({severity: 'success', summary: 'Update Success', detail: 'Order status update!'})
      let cartListIndex = this.orders.findIndex((item: any) => item.orderLabel === order.orderLabel)
      this.orders.splice(cartListIndex, 1)
    })
  }
}
