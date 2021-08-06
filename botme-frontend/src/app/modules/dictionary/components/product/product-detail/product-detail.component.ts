import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../model/product';
import { CategoryService } from '../../../service/category.service';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private productservice: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute, private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {
  }

  productForm = this.fb.group({
    restaurantId: [],
    productId: [],
    productLabel: [],
    productName: [, Validators.required],
    productUOM: [, Validators.required],
    productType: [, Validators.required],
    productCategory: [, Validators.required],
    productSerialNo: [],
    productBarcode: [],
    productDesc: [],
    productIngredients: [],
    productRate: this.fb.group({
      standard: new FormControl(0, [Validators.required, Validators.min(0.1)]),
      medium: [0],
      large: [0],
      small: [0]
    }),
    productFlavor: [],
    productProportion: [],
    productToppings: [],
    productAddons: [],
    productNutrition: this.fb.group({
      calories: [],
      fats: [],
      proteins: []
    }),
    productOptions: new FormArray([]),
    productHistory: [],
    productImage: [],
    productTags: [],
    productAttributes: this.fb.group({
      halal: [false],
      vegan: [false],
      vegetarian: [false],
      glutenFree: [false],

    }),
    offeringTime: [],
    productVariant: [],
    productActive: true,
  });

  productId = ''
  productOptions = this.productForm.get('productOptions') as FormArray;
  validationError = {
    productName: false,
    productLabel: false,
    productType: false,
    productCategory: false,
    standard: false,
    productUOM: false
  }
  loading = true
  editMode = false
  newForm = false
  productType = ['Item', 'Platter', 'Meal', 'Addon', 'Ingredient']
  productUOM = ['Single', 'Plate', 'Bowl', 'Platter', 'Piece', 'Skewer', 'Cup', 'Glass', 'Bottle', 'Box', 'Pack']
  categories = []
  addons: any
  variants: any
  productList = []
  productIngredients = []

  product: Product = {
    restaurantId: '1',
    productId: '',
    productLabel: '',
    productName: '',
    productUOM: '',
    productType: '',
    productCategory: '',
    productSerialNo: '',
    productBarcode: '',
    productDesc: '',
    productIngredients: [''],
    productRate: {
      standard: 0,
      small: 0,
      large: 0,
      medium: 0,
    },
    productFlavor: [''],
    productProportion: [''],
    productToppings: [''],
    productAddons: [''],
    productNutrition: {
      calories: '',
      fats: '',
      proteins: ''
    },
    productOptions: [[]],
    productHistory: '',
    productImage: [''],
    productTags: [''],
    productAttributes: {
      halal: true,
      vegan: true,
      vegetarian: true,
      glutenFree: true,

    },
    offeringTime: [''],
    productVariant: [''],
    productActive: true,
    updatedAt: null,
    createdAt: null
  }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.productId = this.route.snapshot.queryParams['productId'];
    this.product.productId = this.productId;

    this.getCategories()
    this.getProductsList()
    this.getProductVariants()
    this.getIngredients()

    if (!this.product.productId) {
      this.newForm = true
    } else {
      this.getProductDetail(this.product.productId);
    }


    this.productForm.valueChanges.subscribe(res => {
      this.product = res
      this.getProductVariants();
    })

    this.disableEdit()
  }

  disableEdit() {
    this.editMode = false
    this.productForm.disable()
  }


  enableEdit() {
    this.editMode = true
    this.productForm.enable()
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      let productRate = this.productForm.controls['productRate'] as FormGroup;
      (this.productForm.controls['productName'].errors) ? this.validationError.productName = true : false;
      (this.productForm.controls['productUOM'].errors) ? this.validationError.productUOM = true : false;
      (this.productForm.controls['productType'].errors) ? this.validationError.productType = true : false;
      (productRate.controls['standard'].errors) ? this.validationError.standard = true : false;
      (this.productForm.controls['productCategory'].errors) ? this.validationError.productCategory = true : false;

      this.messageService.add({ severity: 'error', summary: 'Validation Failed', detail: `Kindly fill in the required fields` });
      return;
    }

    if (this.product.productId) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

 getProductDetail(productId: string): void {
    this.productservice.getProductById(productId).subscribe(
      result => {
        (result.status === 'success') ? this.product = result.payload[0] : null
        if (this.product) {
          try {
            this.productForm.patchValue(this.product);

            for (let opt in result.payload[0].productOptions) {
              this.productOptions.push(new FormControl(result.payload[0].productOptions[opt]))
            }
            this.loading = false
          } catch (err) {
            console.log(err);
          }
        }
      }
    );
  }


  getProductsList() {
    if (this.product.productType === 'Meal') {
      this.productservice.getProductsByType('Addon').subscribe(
        result => {
          this.productList = result.payload
        })
    } else {
      this.productservice.getProductsByType('').subscribe(
        result => {
          this.productList = result.payload
        })
    }
  }

  getIngredients() {
    this.productservice.getProductsByType('Ingredient').subscribe(
      result => {
        if (result.status === 'success')
          this.productIngredients = result.payload
      })
  }

  getCategories() {

    this.categoryService.getCategories().subscribe(
      result => {
        this.categories = result.payload
      }
    )
  }


  getProductVariants(): void {
    if (this.product.productCategory) {
      this.productservice.getProductsByCategory(this.product.productCategory).subscribe(
        result => {
          this.variants = result.payload
        })
    }
  }

  addProductOptionsArray() {
    return new FormControl([])
  }
  addProductOptionsInArray() {
    this.productOptions.push(this.addProductOptionsArray())
  }

  removeProductOptionsArray(ri: number) {
    this.productOptions.removeAt(ri)
  }

  updateProduct(): void {
    this.confirmationService.confirm({
      message: 'Do you want to update this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.product.productId = this.productId
        this.productservice.updateProduct(this.product).subscribe(result => {
          if (result.status === 'success') {
            this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'Product updated!' })
            this.disableEdit()
          } else {
            this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: `Reason: ${result.payload}` })
          }
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });


  }

  addProduct() {
    this.confirmationService.confirm({
      message: 'Do you want to add this record?',
      header: 'Add Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.productservice.addProduct(this.product).subscribe(result => {
          if (result.status === 'success') {
            this.messageService.add({ severity: 'info', summary: 'Add Success', detail: `Product Added!` })
            this.productId = result.payload.productId
            this.product.productId = this.productId
          } else {
            this.messageService.add({ severity: 'error', summary: 'Add Failed', detail: `Reason: ${result.payload}` })
          }
        });

      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

}
