import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../service/customer.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  constructor(private customerService: CustomerService,private _router:Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  customers: Array<any> = [];

  selectedCustomer?: string;

  onSelect(customer: any): void {
    this.selectedCustomer = customer.customerId;
  }
  navigateToAddCustomer(){
    this._router.navigate(['add-customer'], { relativeTo: this.route })
  }
  getCustomers(): void {
    this.customerService.getCustomers()
      .subscribe(result => this.customers = result.payload);
  }
}
