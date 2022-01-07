import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../../../model/customer';
import { CustomerService } from '../../../service/customer.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MessageService } from "primeng/api";

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  editMode = false
  newForm = false
  customerLabel = 0

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private customerService: CustomerService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  customerForm = this.fb.group({
    customerName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    customerEmail: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    customerPhone: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    customerActive: true,
    customerLabel: new FormControl(0)
  });

  formMode = 'update';
  customerId = '';
  customer: Customer = {
    restaurantId: '',
    customerId: '',
    customerLabel: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerActive: true
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.customerId = params.customerId;
      });
    if (!this.customerId) {
      this.formMode = 'new'
      this.newForm = true
    } else {
      this.getCustomerDetail(this.customerId);
    }
    this.disableEdit()
  }

  disableEdit() {
    this.editMode = false
    this.customerForm.disable()
  }

  enableEdit() {
    this.editMode = true
    this.customerForm.enable()
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }
    if (this.formMode === 'update') {
      this.updateCustomer(this.customer);
    } else {
      this.addCustomer()
    }
  }

  getCustomerDetail(customerId: string): void {
    this.customerService.getCustomerDetail(customerId).subscribe(
      result => {
        this.customer = result.payload
        this.customerLabel = result.payload.customerLabel
        this.customerForm.patchValue({
          customerName: this.customer?.customerName,
          customerEmail: this.customer?.customerEmail,
          customerPhone: this.customer?.customerPhone,
          customerActive: this.customer?.customerActive,
          customerLabel: this.customer?.customerLabel
        })
      }
    );
  }

  updateCustomer(customer: object): void {
    this.customer.customerName = this.customerForm.getRawValue().customerName
    this.customer.customerEmail = this.customerForm.getRawValue().customerEmail
    this.customer.customerPhone = this.customerForm.getRawValue().customerPhone
    this.customer.customerActive = this.customerForm.getRawValue().customerActive

    this.confirmationService.confirm({
      message: 'Do you want to update this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.customerService.updateCustomer(this.customer)
          .subscribe(result => {
            if (result.status === 'success') {
              this.customer = result.payload
              this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'Customer updated!' })
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Update Failed',
                detail: `Reason: ${result.payload}`
              })
            }
            this.disableEdit()
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
        this.disableEdit()
      }
    })
  }

  addCustomer(): void {
    this.customer.customerName = this.customerForm.getRawValue().customerName
    this.customer.customerEmail = this.customerForm.getRawValue().customerEmail
    this.customer.customerPhone = this.customerForm.getRawValue().customerPhone
    this.confirmationService.confirm({
      message: 'Do you want to add this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.customerService.registerCustomer(this.customer)
          .subscribe(result => {
            if (result.status === 'success') {
              this.customer = result.payload
              this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'Customer added!' })
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Add Failed',
                detail: `Reason: ${result.payload}`
              })
            }
            this.disableEdit()
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
        this.disableEdit()
      }
    })
  }
}
