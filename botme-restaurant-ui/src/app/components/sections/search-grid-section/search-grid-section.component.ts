import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {MenuService} from 'src/app/services/menu.service';
import {SocketService} from 'src/app/services/socket.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

declare var jQuery: any;

@Component({
  selector: 'app-search-grid-section',
  templateUrl: './search-grid-section.component.html',
  styleUrls: ['./search-grid-section.component.scss']
})
export class SearchGridSectionComponent implements OnInit {

  products: any
  filteredProducts: any
  categories = []
  categoryList: { categoryId: string, categoryName: string, selected: boolean }[] = []
  loading = true
  cartVisible = false;
  sofiaMessage = "Message from Sofia"

  isLoading = false;
  showSpinner: boolean = false
  //search text
  searchControl = new FormControl("")
  searchText = ''
  productCategory = ''

  constructor(private _http: HttpClient, private menuservice: MenuService,
              private cartService: CartService,
              private socketService: SocketService) {
  }

  ngOnInit() {
    this.isLoading = true
    this.getCategory();
    this.getWSMessage();
    this.filterProductsByName()
  }

  getProducts(): void {
    this.menuservice.getProducts()
      .subscribe(result => {
        this.products = result.payload

        if (Array.isArray(this.products)) {
          for (let product of this.products) {
            product.productCategoryName = this.getCategoryName(product.productCategory);
            (!this.categoryList.find(category => category.categoryId === product.productCategory)) ?
              this.categoryList.push({
                categoryId: product.productCategory,
                categoryName: product.productCategoryName,
                selected: false
              }) : null;
            this.filteredProducts = this.products
            this.isLoading = false
          }
        } else {
          this.products = []
          this.filteredProducts = this.products
          this.isLoading = false
        }
        console.log(this.filteredProducts)
      });
  }

  getProductsByCategory(category: string) {
    let products: any = this.products.filter((product: { productCategory: string; }) => product.productCategory === category);
    return products;
  }

  getCategory() {
    this.menuservice.getCategory()
      .subscribe(result => {
        this.categories = result.payload

        if (Array.isArray(this.categories)) {
          this.getProducts();
        } else {
          this.categories = []
        }
      });
  }

  getCategoryName(catId: string) {
    let cat: any = this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    if (cat) return cat.categoryName

    return null;
  }

  filterProducts(category: any) {
    // this.filteredProducts = this.filteredProducts.filter((product: { productCategory: string; }) => product.productCategory === categoryId);
    this.isLoading = true
    this.categoryList.forEach((item) => {
      item.selected = false
    })
    category.selected = true
    this._http.get<any>(this.menuservice.apiBaseUrl + "/food/product/search?productCategory=" + category.categoryId + '&searchText=' + this.searchText).subscribe(
      ((res: any) => {
        this.filteredProducts = res.payload
        this.isLoading = false
      })
    )
  }

  filterProductsByName() {
    // this.filteredProducts = this.products.filter((product: { productName: string; }) => product.productName.toLowerCase().indexOf(text) >= 0);
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredProducts = []
          this.isLoading = true
        }),
        switchMap(value => this._http.get<any>(this.menuservice.apiBaseUrl + "/food/product/search?searchText=" + value + '&productCategory=' + this.productCategory)
          .pipe(
            finalize(() => {
              this.isLoading = false
              this.searchText = value
            }),
          )
        )
      ).subscribe((res: any) => {
      this.filteredProducts = res.payload
    });

  }


  addToCart(productId: string) {
    this.cartService.addToCart(productId);
    document.getElementById("btnProductCart")?.click()
  }

  sendWSMessage(text: string) {
    this.socketService.sendMessage(text);
  }

  getWSMessage() {
    this.socketService.messages.subscribe(r => {
        let res: any = r
        this.sofiaMessage = res.message.text
      }
    )
  }

  filterProductByPriceRange() {
    let data: any = localStorage.getItem('filterItem')
    data = JSON.parse(data)
    // this.isLoading = true
    // this.filteredProducts = []
    // // this._http.get<any>(this.menuservice.apiBaseUrl + "/food/product/search?priceMin=" + data.priceMin + '&priceMax=' + data.priceMax).subscribe(
    // //   ((res: any) => {
    // //     this.filteredProducts = res.payload
    // //     this.isLoading = false
    // //   })
    // )
  }
}
