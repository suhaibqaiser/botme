import {Component, OnInit} from '@angular/core';
import {MenuService} from "../../../service/menu.service";
import {ProductService} from "../../../service/product.service";
import {CategoryService} from "../../../service/category.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {

  loading: boolean = true;
  menus: Array<any> = [];
  categories?: any
  products?: any

  constructor(private menuService: MenuService,
              private productService: ProductService,
              private categoryService: CategoryService,
              private _router: Router,
              private route: ActivatedRoute) {
  }

  async ngOnInit() {
    await this.getCategories()
    await this.getProducts()
    await this.getMenus()
  }

  async getMenus() {
    this.menuService.getAllMenu()
      .subscribe(result => {
        this.menus = result.payload
        if (Array.isArray(this.menus)) {
          for (let menu of this.menus) {
            menu.categoryName = this.getCategoryName(menu.categoryId)
            menu.productName = this.getProductName(menu.productId)
          }
        }
        this.loading = false;
      });
  }

  async getCategories() {
    this.categoryService.getCategories().subscribe(
      result => {
        this.categories = result.payload
      }
    )
  }

  async getProducts() {
    this.productService.getProducts()
      .subscribe(result => {
        this.products = result.payload
      });
  }

  getCategoryName(id: any) {
    let category = this.categories.find((category: any) => category.categoryId === id);
    if (category) return category.categoryName
    return null;
  }

  getProductName(id: any) {
    let product = this.products.find((product: any) => product.productId === id);
    if (product) return product.categoryName
    return null;
  }
}
