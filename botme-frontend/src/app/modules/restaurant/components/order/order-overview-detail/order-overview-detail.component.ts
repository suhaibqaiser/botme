import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../service/order.service";
import {HelperService} from "../../../../../services/helper.service";
import {ProductService} from "../../../service/product.service";

@Component({
  selector: 'app-order-overview-detail',
  templateUrl: './order-overview-detail.component.html',
  styleUrls: ['./order-overview-detail.component.css']
})
export class OrderOverviewDetailComponent implements OnInit {
  orderDetailObj: any = {}
  products: any = []
  loader = true

  constructor(private _productService: ProductService, public _helperService: HelperService, private _orderService: OrderService) {
    this.orderDetailObj = this._orderService.getOrderDetailObject()
    this.getProducts()
  }

  ngOnInit(): void {
  }

  async getProducts() {
    await this._productService.getProducts()
      .subscribe(result => {
        if (result.status === 'success') {
          this.products = result.payload
        }
        this.loader = false
      });
    return true
  }
}
