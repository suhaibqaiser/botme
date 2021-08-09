import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Reservation } from '../../../model/reservation';
import { CustomerService } from '../../../service/customer.service';
import { ReservationService } from '../../../service/reservation.service';
import { TableService } from '../../../service/table.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.css']
})
export class ReservationDetailComponent implements OnInit {

  //form edition
  editMode = false
  constructor(private reservationService: ReservationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private tableService: TableService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  reservation: Reservation = {
    reservationMeta: {
      customerArrival: '',
      customerSeated: '',
      customerDeparture: '',
      customerWaiting: ''
    },
    reservationSeats: 1,
    reservationDatetime: '',
    reservationType: '',
    reservationSource: '',
    reservationId: '',
    customer: '',
    table: ''
  };


  reservationId: string = ''
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
  tables?: any

  reservationForm = this.fb.group({
    reservationSeats: new FormControl(null, [Validators.required, Validators.maxLength(3)]),
    reservationType: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    reservationSource: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    customer: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    table: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    customerArrival: new FormControl(''),
    customerWaiting: new FormControl(''),
    customerSeated: new FormControl(''),
    customerDeparture: new FormControl(''),
  });


  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.reservationId = params.reservationId;
      });
    if (this.reservationId) {
      this.findReservation(this.reservationId);
      this.editMode = false
      this.reservationForm.disable()
    } else {
      this.formMode = 'new'
      this.editMode = false
      this.reservationForm.disable()
    }
    this.getCustomers()
    this.getTables()

    this.reservationForm.valueChanges.subscribe(res => {
      this.reservation = res
    })

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
          table: this.reservation.table,
          customerArrival: '',
          customerWaiting: '',
          customerSeated: '',
          customerDeparture: '',
        })
        if (this.reservation.reservationMeta) {
          this.reservationForm.patchValue({
            customerArrival: this.reservation.reservationMeta.customerArrival,
            customerWaiting: this.reservation.reservationMeta.customerWaiting,
            customerSeated: this.reservation.reservationMeta.customerSeated,
            customerDeparture: this.reservation.reservationMeta.customerDeparture

          })
        }
      }
    )
  }

  getCustomers() {
    this.customerService.getCustomers()
      .subscribe(result => {
        this.customers = result.payload;
      })
  }

  getTables() {
    this.tableService.getAllTables()
      .subscribe(result => {
        this.tables = result.payload;
      })
  }

  onSubmit() {
    if (this.reservationForm.status === 'VALID') {
      (this.formMode === 'update') ? this.updateReservation() : this.addReservation();
    } else {
      let controls = ''
      for (let control in this.reservationForm.controls) {
        if (this.reservationForm.controls[control].status === 'INVALID') {
          controls = controls + control + ', '
        }
      }
      alert(`Make sure all the required fields are properly set: ${controls}`);
    }
  }

  updateReservation() {
    this.confirmationService.confirm({
      message: 'Do you want to update this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.reservation.reservationId = this.reservationId
        this.reservationService.editReservation(this.reservation).subscribe(result => {
          (result.status === 'success') ?
            this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'Reservation updated!' }) :
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

  addReservation() {
    this.confirmationService.confirm({
      message: 'Do you want to add this record?',
      header: 'Add Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.reservationService.addReservation(this.reservation).subscribe(result => {
          (result.status === 'success') ?
            this.messageService.add({ severity: 'info', summary: 'Add Success', detail: 'Reservation Add!' }) :
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

  disableEdit() {
    this.editMode = false
    this.reservationForm.disable()
  }

  enableEdit() {
    this.editMode = true
    this.reservationForm.enable()
  }
}
