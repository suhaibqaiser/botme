import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { CategoryService } from '../../../service/category.service';
import { ProductService } from '../../../service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private productService: ProductService, private _router: Router, private route: ActivatedRoute,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  loading = true
  categories: any

  products: Array<any> = [];

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(result => {
        this.products = result.payload

        if (Array.isArray(this.products)) {
          for (let product of this.products) {
            product.productCategory = this.getCategoryName(product.productCategory)
          }
        } else {
          this.products = []
        }
        this.loading = false
      });
  }

  getCategoryName(catId: string) {
    let cat = this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    if (cat) return cat.categoryName

    return null;
  }
  getCategories() {
    this.categoryService.getCategories().subscribe(
      result => {
        this.categories = result.payload
      }
    )
  }


  clear(table: Table) {
    table.clear();
  }
}
