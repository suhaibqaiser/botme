import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {MenuService} from 'src/app/services/menu.service';
import {SocketService} from 'src/app/services/socket.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

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

  searchList: any
  sortList = [
    {
      'name': 'Sort By Price',
      'value': 0
    },
    {
      'name': 'Sort By Price: Low To High',
      'value': 1
    },
    {
      'name': 'Sort By Price: High To Low',
      'value': -1
    }
  ]
  sortControl = new FormControl(1)

  payload: any = {
    productCategory: '',
    productName: '',
    priceMin: '',
    priceMax: '',
    sortByPrice: ''
  }

  queryParams: any = {
    productCategory: '',
    productName: '',
    priceMin: 0.1,
    priceMax: 99.9,
    sortByPrice: 0
  }

  constructor(private _http: HttpClient, private menuservice: MenuService,
              private cartService: CartService,
              private socketService: SocketService,
              private _router: Router,
              private _route: ActivatedRoute
  ) {
  }

  async ngOnInit() {
    this.searchList = []
    this.isLoading = true
    await this.getQueryParams()
    await this.getCategory();
    this.getWSMessage();
    // this.filterProductsByName('first-call')
  }

  async getQueryParams() {
    this._route.queryParams.subscribe(param => {
      this.queryParams = {
        productCategory: (param && param.productCategory) ? param.productCategory : '',
        productName: (param && param.productName) ? param.productName : '',
        priceMin: (param && param.priceMin) ? param.priceMin : '',
        priceMax: (param && param.priceMax) ? param.priceMax : '',
        sortByPrice: (param && param.sortByPrice) ? param.sortByPrice : 0
      }
      this.payload = this.queryParams
      this.searchControl.setValue(this.payload.productName)
    })
  }

  async getProducts() {
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
                selected: (this.payload.productCategory === product.productCategory)
              }) : null;
          }
        } else {
          this.products = []
          this.filteredProducts = this.products
          this.isLoading = false
        }
        this.filterFromQueryParam()
      });
  }

  async getCategory() {
    this.menuservice.getCategory()
      .subscribe(result => {
        this.categories = result.payload

        if (Array.isArray(this.categories)) {
          this.getProducts();
        } else {
          this.categories = []
        }
        return
      });
  }

  getCategoryName(catId: string) {
    let cat: any = this.categories.find((category: { categoryId: string; }) => category.categoryId === catId);
    if (cat) return cat.categoryName

    return null;
  }

  filterFromQueryParam() {

    let data: any = localStorage.getItem('searchList')
    if (data) {
      data = JSON.parse(data)
      this.searchList = data
    }

    this.filteredProducts = []
    this.isLoading = true

    this.menuservice.getProductsByFiltering(this.queryParams).subscribe(
      ((res: any) => {
        this.filteredProducts = res.status!=='error' ? res.payload : []
        this.isLoading = false
      })
    )
  }

  filterProductsByCategory(category: any) {
    this.isLoading = true
    this.filteredProducts = []
    this.categoryList.forEach((item) => {
      item.selected = false
    })
    category.selected = true

    if (category.categoryId) {
      this.productCategory = category.categoryId
      this.setFilterList('Category', category.categoryName)
      this.payload.productCategory = category.categoryId
      this.setQueryParameters()
    } else {
      this.payload.productCategory = ''
      this.setQueryParameters()
    }
    this.menuservice.getProductsByFiltering(this.payload).subscribe(
      ((res: any) => {
        this.filteredProducts = res.status!=='error' ? res.payload : []
        this.isLoading = false
      })
    )
  }

  filterProductsByName(event: any = null) {
    let text = event && event.target.value ? event.target.value : ''
    this.searchControl.setValue(text)
    if(this.searchControl.value && this.searchControl.value.length){
      this.setFilterList('Search', this.searchControl.value)
      this.payload.productName = this.searchControl.value
      this.setQueryParameters()
    }else{
      this.payload.productName = ''
      this.setQueryParameters()
      this.searchControl.setValue('')
    }
    this.menuservice.getProductsByFiltering(this.payload).subscribe(
      ((res: any) => {
        this.filteredProducts = res.status!=='error' ? res.payload : []
        this.isLoading = false
      })
    )
  }

  filterProductByPriceRange() {
    this.isLoading = true
    this.filteredProducts = []

    let data: any = localStorage.getItem('filterItem')
    data = JSON.parse(data)
    if (data && data.priceMin) {
      this.setFilterList('Filter by price', data.priceMin + '-' + data.priceMax)
      this.payload.priceMin = data.priceMin
      this.payload.priceMax = data.priceMax
      this.setQueryParameters()
    } else {
      this.payload.priceMin = ''
      this.payload.priceMax = ''
      this.setQueryParameters()
    }
    this.menuservice.getProductsByFiltering(this.payload).subscribe(
      ((res: any) => {
        this.filteredProducts = res.status!=='error' ? res.payload : []
        this.isLoading = false
      })
    )
  }

  setQueryParameters() {
    if (!this.payload.productCategory) this.payload.productCategory = ''
    if (!this.payload.productName) this.payload.productName = ''
    if (!this.payload.priceMin) this.payload.priceMin = ''
    if (!this.payload.priceMax) this.payload.priceMax = ''
    if (!this.payload.sortByPrice) this.payload.sortByPrice = ''
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: this.payload,
      queryParamsHandling: 'merge',
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

  sortByPrice() {
    this.isLoading = true
    this.filteredProducts = []
    let url = ''

    if (this.sortControl.value != 0) {
      this.payload.sortByPrice = this.sortControl.value
      this.setQueryParameters()
      this.setFilterList('Sort by price', this.sortControl.value)
    } else {
      this.payload.sortByPrice = 0
      this.setQueryParameters()
    }
    this.menuservice.getProductsByFiltering(this.payload).subscribe(
      ((res: any) => {
        this.filteredProducts = res.status!=='error' ? res.payload : []
        this.isLoading = false
      })
    )
    return true
  }

  resolveImages(product: any) {
    if (product.productImage && product.productImage.length) {
      return 'assets/images/products/' + product.productImage[0]
    }
    return 'assets/images/product-1.png'
  }

  removeFilter(item: any, i: any) {
    this.searchList.splice(i, 1)
    if (item.name == 'Search') {
      this.searchControl.setValue('')
      this.filterProductsByName(null)
    } else if (item.name == 'Category') {
      this.filterProductsByCategory({categoryId: ''})
    } else if (item.name == 'Filter by price') {
      localStorage.clear()
      this.filterProductByPriceRange()
    } else if (item.value == 0 || item.value == 1 || item.value == -1) {
      this.sortControl.setValue(0)
      this.sortByPrice()
    }
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
}
