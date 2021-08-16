import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormControl} from "@angular/forms";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";
import {Menu} from '../../../model/menu'
import {MenuService} from "../../../service/menu.service";
import {CategoryService} from "../../../service/category.service";
import {ProductService} from "../../../service/product.service";

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css']
})
export class MenuDetailComponent implements OnInit {

  editMode = false
  newForm = false
  menuLabel = 0

  constructor(private menuService: MenuService,
              private productService: ProductService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) {
  }

  menu: Menu = {
    menuId: '',
    menuLabel: '',
    menuName: '',
    menuDesc: '',
    productId: '',
    menuActive: false
  }

  menuId = ''
  products?: any
  categories?: any
  selectedProductList?: any
  formMode = 'update'

  rowGroupMetadata: any;

  menuForm = this.fb.group({
    menuId: new FormControl(''),
    menuLabel: new FormControl(''),
    menuName: new FormControl(''),
    menuDesc: new FormControl(''),
    productId: new FormControl(''),
    menuActive: new FormControl(false)
  });


  async ngOnInit() {
    await this.getProducts()
    await this.getCategories()
    this.route.queryParams.subscribe(params => {
      this.menuId = params.menuId;
    });
    if (this.menuId) {
      this.getMenu(this.menuId);
    } else {
      this.formMode = 'new'
      this.newForm = true
    }
    this.menuForm.valueChanges.subscribe(res => {
      this.menu = res
    })
    this.disableEdit()
  }


  disableEdit() {
    this.editMode = false
    this.menuForm.disable()
  }


  enableEdit() {
    this.editMode = true
    this.menuForm.enable()
  }

  onSubmit() {
    if (this.menuForm.status === 'VALID') {
      (this.formMode === 'update') ? this.updateTable() : this.addTable();
    } else {
      let controls = ''
      for (let control in this.menuForm.controls) {
        if (this.menuForm.controls[control].status === 'INVALID') {
          controls = controls + control + ', '
        }
      }
      alert(`Make sure all the required fields are properly set: ${controls}`);
    }
  }

  addTable() {
    this.confirmationService.confirm({
      message: 'Do you want to add this record?',
      header: 'Add Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.menuService.addMenu(this.menu).subscribe(result => {
          (result.status === 'success') ?
            this.messageService.add({severity: 'info', summary: 'Add Success', detail: 'Menu Add!'}) :
            this.messageService.add({severity: 'error', summary: 'Add Failed', detail: `Reason: ${result.payload}`})
          if (result.status === 'success') this.disableEdit()
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled'});
            break;
        }
        this.disableEdit()
      }
    });
  }

  updateTable() {
    this.confirmationService.confirm({
      message: 'Do you want to update this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //this.table.tableId = this.tableId
        this.menuService.updateMenu(this.menu).subscribe(result => {
          (result.status === 'success') ?
            this.messageService.add({severity: 'info', summary: 'Update Success', detail: 'Menu updated!'}) :
            this.messageService.add({severity: 'error', summary: 'Update Failed', detail: `Reason: ${result.payload}`})
          if (result.status === 'success') this.disableEdit()
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled'});
            break;
        }
        this.disableEdit()
      }
    });
  }

  getMenu(Id: string) {
    this.menuService.getMenuById(Id).subscribe(
      result => {
        this.menu = result.payload[0]
        this.menuLabel = result.payload[0].tableLabel
        this.menuForm.patchValue({
          menuId: this.menu.menuId,
          menuLabel: this.menu.menuLabel,
          menuName: this.menu.menuName,
          menuDesc: this.menu.menuDesc,
          productsId: this.menu.productId,
          menuActive: this.menu.menuActive
        })
      }
    )
  }

  async getProducts() {
    console.log('1')
    this.productService.getProducts()
      .subscribe(async result => {
        this.products = await result.payload
        if (Array.isArray(this.products)) {
          for (let product of this.products) {
            product.categoryName = await this.getCategoryName(product.productCategory)
          }
        }
        console.log('products =>', this.products)
        await this.getProductList(this.products)
      });
    return
  }

  async getCategories() {
    console.log('2')
    this.categoryService.getCategories().subscribe(
      result => {
        this.categories = result.payload
      }
    )
  }

  async onProductSelect(event: any) {
    // this.selectedProductList = []
    // if (Array.isArray(event.value)) {
    //   for (let productId of event.value) {
    //     this.selectedProductList.push(await this.getProduct(productId))
    //   }
    // }
    // this.getProductList()
  }

  async getProductList(data: any) {
    // let product = await this.products.find((product: any) => product.productId === id);
    // if (product) return product
    // return null;
    this.products = data
    console.log('3',this.products)
    this.rowGroupMetadata = {}
    if (this.products) {
      for (let i = 0; i < this.products.length; i++) {
        let rowData = this.products[i];
        let representativeName = rowData.categoryName;

        if (i == 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.products[i - 1];
          let previousRowGroup = previousRowData.categoryName;
          if (representativeName === previousRowGroup)
            this.rowGroupMetadata[representativeName].size++;
          else
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
        }
      }
    }
    console.log(this.rowGroupMetadata)
  }

  async getCategoryName(id: any) {
    let category = this.categories.find((category: any) => category.categoryId === id);
    if (category) return category.categoryName
    return null;
  }
}
