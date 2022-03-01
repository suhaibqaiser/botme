import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Table} from 'primeng/table';
import {Order} from '../../../model/order';
import {CustomerService} from '../../../service/customer.service';
import {OrderService} from '../../../service/order.service';
import {HelperService} from "../../../../../services/helper.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  constructor(public _helperService: HelperService, private orderService: OrderService,
              private customerService: CustomerService,
              private _router: Router, private route: ActivatedRoute, private messageService: MessageService) {
  }

  orders: Array<any> = []
  customers: any
  loading = true

  ngOnInit(): void {
    this.getCustomers()

  }

  getOrders() {
    this.orderService.getOrders()
      .subscribe(result => {
        if (result.status === 'success') {
          this.orders = result.payload

          if (Array.isArray(this.orders)) {
            for (let order of this.orders) {
              order.customerName = this.getCustomerName(order.customerId)
            }
          } else {
            this.orders = []
          }
        }
        this.loading = false
      });

  }


  getCustomers(): void {
    this.customerService.getCustomers()
      .subscribe(result => {
        (result.status === 'success') ? this.customers = result.payload : this.customers = [];
        (this.customers) ? this.getOrders() : null;
      });
  }

  getCustomerName(customerId: string) {
    let customer = this.customers.find((customer: { customerId: string; }) => customer.customerId === customerId);
    if (customer) return customer.customerName
    return null;
  }

  clear(table: Table) {
    table.clear();
  }

  deleteOrder(order: any) {
    this.orderService.deleteOrderByLabel(order).subscribe((res: any) => {
      let cartListIndex = this.orders.findIndex((item: any) => item.orderLabel === order.orderLabel)
      this.orders.splice(cartListIndex, 1)
      this.messageService.add({severity: 'info', summary: 'Success', detail: 'Order deleted!'})
    })
  }

}
