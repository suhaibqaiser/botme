import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
    productName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    productDesc: new FormControl('', [Validators.maxLength(300)]),
    productImage: new FormControl(''),
    productAddon: new FormControl(''),
    productVariant: new FormControl(''),
    productPrice: new FormControl('', [Validators.required]),
    category: new FormControl(''),
    productTags: new FormControl(''),
    productActive: true,
  });

  productId = ''
  formMode = 'update';
  categories: any
  addons: any
  variants: any

  product: Product = {
    productId: '',
    productName: '',
    productDesc: '',
    productImage: [null],
    productAddon: [null],
    productVariant: [null],
    productPrice: 0,
    productActive: true,
    productTags: [null],
    category: null
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.productId = params.productId;
        this.product.productId = params.productId;
      });


    if (!this.product.productId) {
      this.formMode = 'new'
    } else {
      this.getProductDetail(this.product.productId);
    }
    this.getCategories()
    this.getProductAddons('60ddd76cea63a8111ebaa0b2')

    this.productForm.valueChanges.subscribe(res => {
      this.product = res
    })


  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    if (this.formMode === 'update') {
      this.updateProduct();
    } else {
      this.addProduct()
    }
  }

  getProductDetail(productId: string): void {
    this.productservice.getProductById(productId).subscribe(
      result => {
        this.product = result.payload[0]

        if (this.product.category) {
          this.getProductVariants(this.product.category._id)
        }
        console.log(this.product);

        this.productForm.patchValue({
          productName: this.product.productName,
          productDesc: this.product.productDesc,
          productImage: this.product.productImage,
          productAddon: this.product.productAddon,
          productVariant: this.product.productVariant,
          productPrice: this.product.productPrice,
          productActive: this.product.productActive,
          productTags: this.product.productTags,
          category: this.product.category._id,
        });

      }
    );
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      result => {
        this.categories = result.payload
      }
    )
  }

  getProductAddons(category: string): void {
    this.productservice.getProductsByCategory(category).subscribe(
      result => {
        this.addons = result.payload
      })
  }

  getProductVariants(category: string): void {
    this.productservice.getProductsByCategory(category).subscribe(
      result => {
        this.variants = result.payload
      })
  }

  updateProduct(): void {
    this.confirmationService.confirm({
      message: 'Do you want to update this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.product.productId = this.productId

        console.log(this.product);
        this.productservice.updateProduct(this.product).subscribe(result => {
          (result.status === 'success') ?
            this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'Product updated!' }) :
            this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: `Reason: ${result.payload}` })
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
          (result.status === 'success') ?
            this.messageService.add({ severity: 'info', summary: 'Add Success', detail: 'Product Added!' }) :
            this.messageService.add({ severity: 'error', summary: 'Add Failed', detail: `Reason: ${result.payload}` })
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
