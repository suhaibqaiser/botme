import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Table } from 'primeng/table';
import { Category } from '../../../model/category';
import { CategoryService } from '../../../service/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  constructor(private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  categories: [Category] = [{
    categoryId: '', categoryName: '', categoryActive: true
  }]
  newCategory: any
  categoryDialog = false

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res.payload
    })
  }

  addCategory() {
    this.categoryService.addCategory(this.newCategory).subscribe(res => {
      (res.status === 'success') ?
        this.messageService.add({ severity: 'info', summary: 'Add Success', detail: 'Category added!' }) :
        this.messageService.add({ severity: 'error', summary: 'Add Failed', detail: `Reason: ${res.payload}` })
    })
  }

  editCategory(id: any) {
    this.categoryService.editCategory(this.categories[id]).subscribe(res => {
      (res.status === 'success') ?
        this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'Category updated!' }) :
        this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: `Reason: ${res.payload}` })
    })
  }

  removeCategory(id: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.categoryService.removeCategory(this.categories[id].categoryId).subscribe(res => {
          if (res.status === 'success') {
            this.messageService.add({ severity: 'info', summary: 'Delete Success', detail: 'Category deleted!' })
            this.categories.splice(id, 1)
          } else {
            this.messageService.add({ severity: 'error', summary: 'Delete Failed', detail: `Reason: ${res.payload}` })
          }
        })
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

  addNew() {
    let nextId = this.categories.length + 1
    this.newCategory = {
      categoryId: nextId,
      categoryName: '',
      categoryActive: true
    }

    this.categoryDialog = true
  }

  save() {
    this.categories.push(this.newCategory);
    this.addCategory();
    this.categoryDialog = false
  }


  clear(table: Table) {
    table.clear();
}
}
