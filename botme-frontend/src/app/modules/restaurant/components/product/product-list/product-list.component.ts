import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private productService: ProductService, private _router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getProducts();
  }

  products: Array<any> = [];

  selectedProduct?: string;

  onSelect(product: any): void {
    this.selectedProduct = product.customerId;
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(result => this.products = result.payload);
  }

}
