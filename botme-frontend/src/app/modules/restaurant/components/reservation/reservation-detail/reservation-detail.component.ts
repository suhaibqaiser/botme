import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../../../model/customer';
import { Reservation } from '../../../model/reservation';
import { CustomerService } from '../../../service/customer.service';
import { ReservationService } from '../../../service/reservation.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.css']
})
export class ReservationDetailComponent implements OnInit {

  constructor(private reservationService: ReservationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService: CustomerService
  ) { }

  reservation?: Reservation | any
  reservationId?: string
  formMode = 'update'

  reservationType = [{ name: 'Walk-in' }, { name: 'Booking' }]
  reservationSource = [
    { name: 'On-Premises' },
    { name: 'Phone' },
    { name: 'Website' },
    { name: 'App' },
    { name: 'Sofia' }
  ]
  customers?: any
  searchCustomer?: any

  tables?: any
  suggestedTables?: any

  reservationForm = this.fb.group({
    reservationSeats: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    reservationType: new FormControl(''),
    reservationSource: new FormControl(''),
    customer: new FormControl(''),
    table: new FormControl(''),
    reservationMeta: {
      customerArrival: new FormControl(''),
      customerWaiting: new FormControl(''),
      customerSeated: new FormControl(''),
      customerDeparture: new FormControl(''),
    }
  });


  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.reservationId = params.reservationId;
      });
    if (!this.reservationId) {
      this.formMode = 'new'
    } else {
      this.findReservation(this.reservationId);
    }
    this.getCustomers()
  }

  findReservation(rId: string) {
    this.reservationService.findReservation(rId).subscribe(
      result => {
        this.reservation = result.payload
        this.reservationForm.patchValue({
          reservationSource: this.reservation.reservationSource,
          reservationType: this.reservation.reservationType,
          reservationSeats: this.reservation.reservationSeats,
          customer: this.reservation.customer,
          table: this.reservation.table
        })
        console.log(this.reservationForm)
      }
    )
  }

  getCustomers() {
    this.customerService.getCustomers()
      .subscribe(result => {
        this.customers = result.payload;
      })
  }

  filterCustomers(event: any) {
    let query = event.query
    this.searchCustomer = this.customers.filter(
      (customer: { customerName: string; }) => customer.customerName
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }

  filterTables(event: any) {
    let query = event.query
    this.suggestedTables = this.tables.filter(
      (table: { tableId: string; }) => table.tableId
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }

  onSubmit() { }
  saveChanges() { }
}
