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
  filteredCustomers: any
  filteredOrders: any
  filteredOrdersLabel: any
  filteredStatus: any
  filteredDeviceType: any
  loading = true
  carts: any = []
  products: any = []


  isLoading = false;
  //search text
  searchControl = new FormControl("")

  searchText = ''

  searchList: any

  sortType = [
    {
      'name': 'All',
      'value': 'all'
    },
    {
      'name': 'Dine In',
      'value': 'dine_in'
    },
    {
      'name': 'Pick Up',
      'value': 'pick_up'
    },
    {
      'name': 'Delivery',
      'value': 'delivery'
    }
  ]
  sortControl = new FormControl('all')


  sortStatus = [
    {
      'name': 'Notified',
      'value': 'notified'
    },
    {
      'name': 'Delivered',
      'value': 'delivered'
    },
    {
      'name': 'Cancel',
      'value': 'cancel'
    }
  ]
  sortControlStatus = new FormControl('notified')

  sortDevice = [
    {
      'name': 'All',
      'value': 'all'
    },
    {
      'name': 'Robot',
      'value': 'robot'
    },
    {
      'name': 'Desktop',
      'value': 'desktop'
    }
  ]
  sortControlType = new FormControl('all')


  payload: any = {
    customerName: '',
    sortByOrder: '',
    sortByStatus: '',
    orderLabel: '',
    orderDevice: '',
    orderTimestamp: ''
  }


  queryParams: any = {
    customerName: '',
    sortByOrder: '',
    sortByStatus: '',
    orderLabel: '',
    orderDevice: '',
    orderTimestamp: ''
  }

  filter: any = {
    customerName: '',
    orderType: '',
    orderStatus: '',
    orderLabel: '',
    orderTimestamp: ''
  }


  constructor(private messageService: MessageService, private _http: HttpClient, private _router: Router, private _route: ActivatedRoute, public _helperService: HelperService, private _productService: ProductService, private _orderService: OrderService, private _customerService: CustomerService) {
    clearTimeout(this._helperService.timer)
  }


  async ngOnInit() {
    await this.getProducts()

    this.searchList = []
    this.isLoading = true
    await this.getQueryParams()
    await this.sortByStatus()
    await this.sortByOrder()
    await this.setDate()
  }

  async getQueryParams() {
    this._route.queryParams.subscribe(param => {
      this.queryParams = {
        customerName: (param && param.customerName) ? param.customerName : '',
        orderStatus: (param && param.orderStatus) ? param.orderStatus : '',
        orderType: (param && param.orderType) ? param.orderType : '',
        orderLabel: (param && param.orderLabel) ? param.orderLabel : '',
        orderTimestamp: (param && param.orderTimestamp) ? param.orderTimestamp : ''
      }
      this.payload = this.queryParams
      this.searchControl.setValue(this.payload.customerName)
      this.searchControl.setValue(this.payload.orderLabel)
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
          //console.log(this.orders)
        }
        this.loading = false
        this.filterFromQueryParam()
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

  
  filterFromQueryParam() {

    let data: any = localStorage.getItem('searchList')
    if (data) {
      data = JSON.parse(data)
      this.searchList = data
    }

    this.filteredOrders = []
    this.isLoading = true

   this._customerService.getOrdersByFiltering(this.queryParams).subscribe(
      ((res: any) => {
        this.filteredOrders = res.status !== 'error' ? res.payload : []
        this.isLoading = false
      })
    )
  }

  filterCustomersByName(event: any = null) {
    let text = event && event.target.value ? event.target.value : ''
    this.searchControl.setValue(text)
    console.log(text)
    if (!!text) {
      this.setFilterList('customerName', this.searchControl.value)
      this.payload.customerName = this.searchControl.value
      this.filter.customerName = this.searchControl.value
      this.setQueryParameters()
    } else {
      console.log(this.searchControl.value)
      this.payload.customerName = ''
      this.filter.customerName = this.searchControl.value
      this.setQueryParameters()
      this.searchControl.setValue('')
    }
    //console.log(this.searchControl.value);

    this._customerService.getOrdersByFiltering(this.filter).subscribe(
      ((res: any) => {
        console.log(res);

        this.orders = res.status !== 'error' ? res.payload : []
        this.resolveFilter(res.payload)

        this.isLoading = false

      })
    )
  }

  filterOrdersByLabel(event: any = null) {
    let text = event && event.target.value ? event.target.value : ''
    this.searchControl.setValue(text)
    if (this.searchControl.value && this.searchControl.value.length) {
      this.setFilterList('Order Id', this.searchControl.value)
      this.payload.orderLabel = this.searchControl.value
      this.filter.orderLabel = this.searchControl.value
      this.setQueryParameters()
    } else {
      this.payload.orderLabel = ''
      this.filter.orderLabel = this.searchControl.value
      this.setQueryParameters()
      this.searchControl.setValue('')
    }
    console.log(this.searchControl.value);
    console.log('filter=>', this.filter);


    this._customerService.getOrdersByFiltering(this.filter).subscribe(
      ((res: any) => {
        console.log(res);

        this.orders = res.status !== 'error' ? res.payload : []
        this.resolveFilter(res.payload)

        this.isLoading = false

      })
    )
  }

  setDate(event: any = null) {
    this.filter.orderTimestamp = event.target.value
    this._customerService.getOrdersByFiltering(this.filter).subscribe(
      ((res: any) => {
        console.log(res);

        this.orders = res.status !== 'error' ? res.payload : []
        this.resolveFilter(res.payload)

        this.isLoading = false

      })
    )
  }


  sortByStatus() {
    this.isLoading = true
    this.filteredStatus = []
    let url = ''

    if (this.sortControlStatus.value != 'Notified') {
      this.payload.sortByStatus = this.sortControlStatus.value
      this.filter.orderStatus = this.sortControlStatus.value
      this.setQueryParameters()
      if (this.sortControlStatus.value == 'deliverd') {
        this.setFilterList('', 'Deliverd')
      } else if (this.sortControlStatus.value == 'cancel') {
        this.setFilterList('', 'Cancel')
      }
    } else {
      this.payload.sortByStatus = 'notified'
      this.setQueryParameters()
    }
    this._customerService.getOrdersByFiltering(this.filter).subscribe(
      ((res: any) => {
        console.log(this.sortControlStatus.value);

        this.orders = res.status !== 'error' ? res.payload : []
        this.resolveFilter(res.payload)

        this.isLoading = false

      })
    )
    return true
  }


  sortByOrder() {
    this.isLoading = true
    this.filteredOrders = []
    let url = ''

    if (this.sortControl.value != 'All') {
      this.payload.sortByOrder = this.sortControl.value
      this.filter.orderType = this.sortControl.value
      this.setQueryParameters()
      if (this.sortControl.value == 'dine_in') {
        this.setFilterList('', 'Dine In')
      } else if (this.sortControl.value == 'pick_up') {
        this.setFilterList('', 'Pick Up')
      } else if (this.sortControl.value == 'delivery') {
        this.setFilterList('', 'Delivery')
      }
    } else {
      this.payload.sortByOrder = 'all'
      this.setQueryParameters()
    }
    this._customerService.getOrdersByFiltering(this.filter).subscribe(
      ((res: any) => {
        console.log(this.sortControl.value);

        this.orders = res.status !== 'error' ? res.payload : []
        this.resolveFilter(res.payload)

        this.isLoading = false

      })
    )
    return true
  }


  filteringOrder() {
    console.log("order=>", this.filter);
    this._customerService.getOrdersByFiltering(this.filter).subscribe(
      ((res: any) => {
        console.log('res=>', res);
        this.orders = res.status !== 'error' ? res.payload : []
        this.resolveFilter(res.payload)
        this.isLoading = false

      }))
  }

  resolveFilter(orders: any = {}) {
    if (Array.isArray(orders)) {
      for (let order of orders) {
        order.carts = this.getCartByOrderLabel(order.orderLabel)
        order.productTotalPrice = order.carts.reduce((prev: any, next: any) => {
          return prev + next.productTotalPrice
        }, 0)
        order.customer = this.getCustomerName(order.customerId)
      }
    }
  }

  sortByDeviceType() {
    this.isLoading = true
    this.filteredDeviceType = []
    let url = ''

    if (this.sortControlType.value != 'All') {
      this.payload.sortByDeviceType = this.sortControlType.value
      this.filter.deviceType = this.sortControlType.value
      this.setQueryParameters()
      if (this.sortControlType.value == 'robot') {
        this.setFilterList('', 'Robot')
      } else if (this.sortControlType.value == 'desktop') {
        this.setFilterList('', 'Desktop')
      }
    } else {
      this.payload.sortByDeviceType = 'all'
      this.setQueryParameters()
    }
    // this._customerService.getOrdersByFiltering(this.filter).subscribe(
    //   ((res: any) => {
    //     console.log(this.sortControlType.value);

    //     this.orders = res.status !== 'error' ? res.payload : []
    //  this.resolveFilter(res.payload)

    //     this.isLoading = false

    //   })
    // )
    return true
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
    if (!this.payload.customerName) this.payload.customerName = ''
    if (!this.payload.orderStatus) this.payload.orderStatus = ''
    if (!this.payload.orderType) this.payload.orderType = ''
    if (!this.payload.orderLabel) this.payload.orderLabel = ''
    if (!this.payload.orderTimestamp) this.payload.orderTimestamp = ''
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
    this._orderService.updateOrderStatus(order.orderLabel, order.orderType, orderStatus, order.clientID).subscribe((res: any) => {
      this.messageService.add({severity: 'success', summary: 'Update Success', detail: 'Order status update!'})
      let cartListIndex = this.orders.findIndex((item: any) => item.orderLabel === order.orderLabel)
      this.orders.splice(cartListIndex, 1)
    })
  }
}
