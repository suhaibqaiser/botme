import {Component, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {MenuService} from 'src/app/services/menu.service';
import {SocketService} from 'src/app/services/socket.service';
import {FormControl} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

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

  // List and filtering
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
    sortByPrice: '',
    ratingMin: '',
    ratingMax: ''
  }

  queryParams: any = {
    productCategory: '',
    productName: '',
    priceMin: 0.1,
    priceMax: 99.9,
    sortByPrice: 0,
    ratingMin: 1,
    ratingMax: 5
  }

  /// product customization

  productCustomizeModal: any
  productCustomizationSlider: any
  slideToShow: any

  orderedProductsList: any
  selectProductRatesField = new FormControl('')
  productSizeList = ['standard', 'medium', 'large', 'small']
  singleCustomProductObj: any = {
    productName: '',
    productId: '',
    productImage: '',
    productRate: {},
    productServingSize: '',
    productOptions: [],
    productIngredients: [],
    productFlavors: [],
    productAddons: [],
    productToppings: [],
    productQuantity: 0,
    productPrice: 0,
    productTotalPrice: 0
  }

  constructor(private _http: HttpClient, private menuservice: MenuService,
              private cartService: CartService,
              private socketService: SocketService,
              private _router: Router,
              private _route: ActivatedRoute
  ) {
  }

  async ngOnInit() {
    this.productCustomizeModal = {}
    this.productCustomizationSlider = [0, 1, 2, 3]
    this.slideToShow = 0
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
        ratingMin: (param && param.ratingMin) ? param.ratingMin : '',
        ratingMax: (param && param.ratingMax) ? param.ratingMax : '',
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
        console.log('categories', result.payload)
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
        this.filteredProducts = res.status !== 'error' ? res.payload : []
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
        this.filteredProducts = res.status !== 'error' ? res.payload : []
        window.scroll(0, 200);
        this.isLoading = false
      })
    )
  }

  filterProductsByName(event: any = null) {
    let text = event && event.target.value ? event.target.value : ''
    this.searchControl.setValue(text)
    if (this.searchControl.value && this.searchControl.value.length) {
      this.setFilterList('Search', this.searchControl.value)
      this.payload.productName = this.searchControl.value
      this.setQueryParameters()
    } else {
      this.payload.productName = ''
      this.setQueryParameters()
      this.searchControl.setValue('')
    }
    this.menuservice.getProductsByFiltering(this.payload).subscribe(
      ((res: any) => {
        this.filteredProducts = res.status !== 'error' ? res.payload : []
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
        this.filteredProducts = res.status !== 'error' ? res.payload : []
        this.isLoading = false
      })
    )
  }

  filterProductByRating() {
    this.isLoading = true
    this.filteredProducts = []

    let data: any = localStorage.getItem('ratingItem')
    data = JSON.parse(data)
    if (data && data.ratingMin) {
      this.setFilterList('Filter by rating', data.ratingMin + '-' + data.ratingMax)
      this.payload.ratingMin = data.ratingMin
      this.payload.ratingMax = data.ratingMax
      this.setQueryParameters()
    } else {
      this.payload.ratingMin = ''
      this.payload.ratingMax = ''
      this.setQueryParameters()
    }
    this.menuservice.getProductsByFiltering(this.payload).subscribe(
      ((res: any) => {
        this.filteredProducts = res.status !== 'error' ? res.payload : []
        this.isLoading = false
      })
    )
  }

  setQueryParameters() {
    if (!this.payload.productCategory) this.payload.productCategory = ''
    if (!this.payload.productName) this.payload.productName = ''
    if (!this.payload.priceMin) this.payload.priceMin = ''
    if (!this.payload.priceMax) this.payload.priceMax = ''
    if (!this.payload.ratingMin) this.payload.ratingMin = ''
    if (!this.payload.ratingMax) this.payload.ratingMax = ''
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
      if (this.sortControl.value == -1) {
        this.setFilterList('Sort by price', 'High To Low')
      } else if (this.sortControl.value == 1) {
        this.setFilterList('Sort by price', 'Low To High')
      }
    } else {
      this.payload.sortByPrice = 0
      this.setQueryParameters()
    }
    this.menuservice.getProductsByFiltering(this.payload).subscribe(
      ((res: any) => {
        this.filteredProducts = res.status !== 'error' ? res.payload : []
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

  resolveRating(product: any) {
    let data = []
    for (let i = 1; i <= 5; i++) {
      if (i <= product.productRating) {
        data.push({star: 'flaticon-star-1'})
      } else {
        data.push({star: 'flaticon-star-2'})
      }
    }
    return data
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
    } else if (item.value == 'High To Low' || item.value == 'Low To High') {
      this.sortControl.setValue(0)
      this.sortByPrice()
    } else if (item.name === 'Filter by rating') {
      localStorage.removeItem('ratingItem')
      this.filterProductByRating()
    }
    localStorage.setItem('searchList', JSON.stringify(this.searchList))
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

  getProductById(productId: any) {
    return this.products.find((item: any) => item.productId == productId)
  }

  getProductByType(productType: any) {
    return this.products.filter((item: any) => item.productType == productType)
  }


  setProductCustomization(product: any) {
    this.slideToShow = 0

    let productOptionsList: any = []
    let productIngredientList: any = []
    let productFlavoursList: any = []
    let productAddonsList: any = []
    let productToppingsList: any = []
    if (product.productOptions && product.productOptions.length) {
      product.productOptions.forEach((array: any) => {
        array.forEach((item: any, i: any) => {
          let obj = this.getProductById(item)
          productOptionsList.push({
            productId: obj.productId,
            productName: obj.productName,
            productImage: this.resolveImages(obj),
            selected: false
          })
        })
      })
    }

    if (product.productIngredients && product.productIngredients.length) {
      product.productIngredients.forEach((item: any, index: any) => {
        let obj = this.getProductById(item)
        productIngredientList.push({
          productId: obj.productId,
          productName: obj.productName,
          productImage: this.resolveImages(obj),
          selected: true
        })
      })
    }

    if (product.productToppings && product.productToppings.length) {
      product.productToppings.forEach((item: any, index: any) => {
        let obj = this.getProductById(item)
        productToppingsList.push({
          productId: obj.productId,
          productName: obj.productName,
          productImage: this.resolveImages(obj),
          productQuantity: 0,
          productPrice: obj.productRate.standard,
          productTotalPrice: 0
        })
      })
    }

    if (product.productFlavor && product.productFlavor.length) {
      product.productFlavor.forEach((item: any, index: any) => {
        productFlavoursList.push({
          flavorName: item,
          selected: false
        })
      })
    }
    let productlist = this.getProductByType('Addon')
    if (productlist && productlist.length) {
      productlist.forEach((item: any) => {
        productAddonsList.push({
          productId: item.productId,
          productName: item.productName,
          productImage: this.resolveImages(item),
          selected: false,
          productQuantity: 0,
          productPrice: item.productRate.standard,
          productTotalPrice: 0
        })
      })
    }

    this.singleCustomProductObj = {
      productName: product.productName,
      productId: product.productId,
      productImage: product.productImage,
      productRate: product.productRate,
      productServingSize: this.productSizeList[0],
      productOptions: productOptionsList,
      productIngredients: productIngredientList,
      productFlavors: productFlavoursList,
      productAddons: productAddonsList,
      productToppings: productToppingsList,
      productQuantity: 0,
      productPrice: product.productRate[this.productSizeList[0]],
      productTotalPrice: product.productRate[this.productSizeList[0]]
    }
    this.selectProductRatesField.setValue(this.productSizeList[0])
  }

  selectProductRate() {
    this.singleCustomProductObj.productTotalPrice = this.singleCustomProductObj.productRate[this.selectProductRatesField.value]
    this.singleCustomProductObj.productServingSize = this.selectProductRatesField.value
  }

  selectFlavor(flavor: any) {
    this.singleCustomProductObj.productFlavors.forEach((item: any) => {
      item.selected = item.flavorName === flavor.flavorName
    })
  }

  previousSlide() {
    this.slideToShow--
    if (this.slideToShow === 3 && this.selectProductRatesField.value === 'single') {
      this.slideToShow--
    }
  }

  nextSlide() {
    this.slideToShow++
    if (this.slideToShow === 3 && this.selectProductRatesField.value === 'single') {
      this.slideToShow++
    }
  }


  selectIngredients(ingredient: any) {
    ingredient.selected = !ingredient.selected
  }

  selectProductOptions(option: any) {
    option.selected = !option.selected
  }

  selectToppings(toppings: any) {
    toppings.selected = !toppings.selected
    toppings.quantity = toppings.selected ? toppings.quantity : 1
    toppings.total = toppings.selected ? toppings.total : toppings.price
    this.customizeBillCalculation()
  }


  customizeBillCalculation() {
    this.singleCustomProductObj.productTotalPrice = this.singleCustomProductObj.productPrice
    this.singleCustomProductObj.productToppings.forEach((item: any) => {
      this.singleCustomProductObj.productTotalPrice += parseInt(item.productTotalPrice)
    })

    this.singleCustomProductObj.productAddons.forEach((item: any) => {
      this.singleCustomProductObj.productTotalPrice += parseInt(item.productTotalPrice)
    })
  }

  addToppingQuantity(toppings: any, type: any) {
    if (type === 'adding') {
      toppings.productQuantity = toppings.productQuantity + 1
    } else if (type === 'subtracting') {
      if (toppings.productQuantity === 0) return
      toppings.productQuantity = toppings.productQuantity - 1
    }
    toppings.productTotalPrice = toppings.productPrice * toppings.productQuantity
    toppings.productTotalPrice = parseFloat(toppings.productTotalPrice).toFixed(1)
    this.customizeBillCalculation()
  }

  addAddonQuantity(addons: any, type: any) {
    if (type === 'adding') {
      addons.productQuantity = addons.productQuantity + 1
    } else if (type === 'subtracting') {
      if (addons.productQuantity === 0) return
      addons.productQuantity = addons.productQuantity - 1
    }
    addons.productTotalPrice = addons.productPrice * addons.productQuantity
    addons.productTotalPrice = parseFloat(addons.productTotalPrice).toFixed(1)
    this.customizeBillCalculation()
  }

  setOrderedProductList(data: any) {
    this.orderedProductsList.push({
      id: Math.floor(Math.random() * 1000000000),

    })
  }
}
