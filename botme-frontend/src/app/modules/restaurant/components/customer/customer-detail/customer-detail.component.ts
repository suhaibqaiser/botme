import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../../../model/customer';
import { CustomerService } from '../../../service/customer.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {

  constructor(private customerService: CustomerService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  customerForm = this.fb.group({
    customerName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    customerEmail: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    customerPhone: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    customerActive: true,
  });

  formMode = 'update';
  customerId = '';
  customer: Customer = {
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
    } else {
      this.getCustomerDetail(this.customerId);
    }
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
        this.customerForm.patchValue({
          customerName: this.customer?.customerName,
          customerEmail: this.customer?.customerEmail,
          customerPhone: this.customer?.customerPhone,
          customerActive: this.customer?.customerActive
        })
      }
    );
  }

  updateCustomer(customer: object): void {
    this.customer.customerName = this.customerForm.getRawValue().customerName
    this.customer.customerEmail = this.customerForm.getRawValue().customerEmail
    this.customer.customerPhone = this.customerForm.getRawValue().customerPhone
    this.customer.customerActive = this.customerForm.getRawValue().customerActive

    this.customerService.updateCustomer(this.customer)
      .subscribe(result => this.customer = result.payload);
  }

  addCustomer(): void {
    this.customer.customerName = this.customerForm.getRawValue().customerName
    this.customer.customerEmail = this.customerForm.getRawValue().customerEmail
    this.customer.customerPhone = this.customerForm.getRawValue().customerPhone
    
    this.customerService.registerCustomer(this.customer)
      .subscribe(result => { this.customer = result.payload })

  }
}
