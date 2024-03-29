import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Cart } from '../../../model/cart';
import { Order } from '../../../model/order';
import { CategoryService } from '../../../service/category.service';
import { CustomerService } from '../../../service/customer.service';
import { OrderService } from '../../../service/order.service';
import { ProductService } from '../../../service/product.service';
import { TableService } from '../../../service/table.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private tableService: TableService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }



  orderForm = this.fb.group({
    orderId: [],
    orderLabel: [],
    orderTimestamp: [],
    orderType: [],
    customerId: [],
    addressId: [],
    tableId: [],
    cartId: [],
    delivery: this.fb.group({
      deliveryDate: [],
      deliverFee: [],
      deliveryNote: [],
    }),
    orderPaymentMethod: [],
    orderSubTotal: [],
    orderTip: [],
    orderDiscount: [],
    orderServiceTax: [],
    orderSalesTax: [],
    orderTotal: [],
    orderActive: true,
  })

  order: Order = {
    restaurantId: '',
    orderId: '',
    orderLabel: '',
    orderTimestamp: new Date,
    orderType: '',
    customerId: '',
    addressId: '',
    tableId: '',
    cartId: '',
    delivery: {
      deliveryDate: null,
      deliverFee: 0,
      deliveryNote: '',
    },
    orderPaymentMethod: '',
    orderSubTotal: 0,
    orderTip: 0,
    orderDiscount: 0,
    orderServiceTax: 0,
    orderSalesTax: 0,
    orderTotal: 0,
    orderActive: true,
  }

  newForm = false
  editMode = false
  loading = true
  orderType = ['Dine In', 'Pickup', 'Delivery']
  customers = []
  tables = []
  addresses = []
  products = []
  categories = []
  cart: Cart = {
    restaurantId: '',
    cartId: '',
    cartLabel: 0,
    cartDiscount: 0,
    cartTotal: 0,
    cartProduct: [{
      productId: '',
      productLabel: '',
      productCategory: '',
      productFlavor: '',
      productProportion: '',
      productToppings: [''],
      productOptions: [['']],
      productRate: {
        standard: 0,
        small: 0,
        medium: 0,
        large: 0,
      },
      productQuantity: 0,
      productNotes: ''
    }]
  }
  paymentMethod = ['Cash', 'Credit/Debit Card', 'Online']
  selectedProduct = ''
  productSelections: Array<any> = []
  dropdowns = {
    flavors: [],
    proportions: [],
    toppings: [],
    options: []
  }



  ngOnInit(): void {
    this.getCustomers();
    this.getTables();
    this.getCategories();
    this.getProducts();

    this.order.orderId = this.route.snapshot.queryParams['orderId'];

    if (!this.order.orderId) {
      this.newForm = true
      this.editMode = true
    } else {
      this.getOrderDetail(this.order.orderId)
      this.disableEdit()
    }
  }

  getOrderDetail(orderId: string) {
    this.orderService.getOrderById(orderId).subscribe(
      result => {
        (result.status === 'success') ? this.order = result.payload[0] : null
        if (this.order) {
          try {
            this.orderForm.patchValue(this.order);
            // for (let opt in result.payload[0].productOptions) {
            //   this.productOptions.push(new FormControl(result.payload[0].productOptions[opt]))
            // }
            this.getCartDetails(this.order.cartId)
            this.loading = false
          } catch (err) {
            console.log(err);
          }
        }
      }
    );
  }

  getCartDetails(cartId: string) {
    this.orderService.getCartById(cartId).subscribe(
      result => {
        (result.status === 'success') ? this.cart = result.payload : null
      }
    )
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe(
      result => {
        (result.status === 'success') ? this.customers = result.payload : null
      }
    )
  }

  getAddressesByCustomer(customerId: string) {
    this.customerService.getAddressesByCustomer(customerId).subscribe(
      result => {
        (result.status === 'success') ? this.addresses = result.payload : null
      }
    )
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      result => {
        (result.status === 'success') ? this.products = result.payload : null
      }
    )
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      result => {
        (result.status === 'success') ? this.categories = result.payload : null
      }
    )
  }

  getTables() {
    this.tableService.getAllTables().subscribe(
      result => {
        (result.status === 'success') ? this.tables = result.payload : null
      }
    )
  }

  disableEdit() {
    this.editMode = false
    this.orderForm.disable()
  }

  enableEdit() {
    this.editMode = true
    this.orderForm.enable()
  }

  // fillProduct(productId: string, index: number) {
  //   let product: any = this.products.find((p: cartProduct) => (p.productId === productId))

  //   if (product) {
  //     this.selectedProduct = product.productId,
  //       this.cartProduct.at(index).patchValue({
  //         productId: product.productId,
  //         productLabel: product.productLabel,
  //         productCategory: product.productCategory,
  //         productFlavor: product.productFlavor,
  //         productProportion: product.productProportion,
  //         productToppings: product.productToppings,
  //         productOptions: product.productOptions,
  //         productRate: product.productRate
  //       })
  //   }
  //   this.productSelections.push({
  //     productId: product.productId,
  //     productFlavor: product.productFlavor,
  //     productProportion: product.productProportion,
  //     productToppings: product.productToppings,
  //     productOptions: product.productOptions,
  //   })
  //   console.log(this.productSelections);
  // }

  // updateProductDropdowns(rowIndex: any) {
  //   console.log('hey');

  //   let selectedProduct = this.cartProduct.at(rowIndex).get('productId')?.value
  //   console.log(selectedProduct);

  //   // let productSelection = this.productSelections.find(
  //   //   (ps: { productId: string; }) => (ps.productId = selectedProduct)
  //   // )

  //   // console.log(productSelection);
  // }



  // removeFromCart() { }

  // addToCart() {
  //   this.cartProduct.push(new FormGroup({
  //     productId: new FormControl(''),
  //     productLabel: new FormControl(''),
  //     productCategory: new FormControl(''),
  //     productFlavor: new FormControl(''),
  //     productProportion: new FormControl(''),
  //     productToppings: new FormControl(''),
  //     productOptions: new FormControl(''),
  //     productRate: new FormGroup({
  //       standard: new FormControl(0),
  //       small: new FormControl(0),
  //       medium: new FormControl(0),
  //       large: new FormControl(0),
  //     }),
  //     productQuantity: new FormControl(''),
  //     productNotes: new FormControl(''),
  //   }));
  // }

  productById(productId: string  | undefined) {
    let p: any = this.products.find((product: { productId: string }) => product.productId == productId);
    return p ? p.productName : "";
  }
  categoryById(categoryId: string | undefined) {
    let p: any = this.categories.find((category: { categoryId: string }) => category.categoryId == categoryId);
    return p ? p.categoryName : "";
  }

  onSubmit() {

  }
}
