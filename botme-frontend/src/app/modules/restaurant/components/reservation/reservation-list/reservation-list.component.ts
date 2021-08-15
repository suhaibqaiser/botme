import {Component, OnInit} from '@angular/core';
import {Table} from 'primeng/table';
import {ReservationService} from "../../../service/reservation.service";
import {TableService} from "../../../service/table.service";
import {CustomerService} from "../../../service/customer.service";

@Component({
  selector: 'app-corpus-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  constructor(private customerService: CustomerService, private tableService: TableService, private reservationService: ReservationService) {
  }

  loading: boolean = true;
  tables: Array<any> = [];
  customers: Array<any> = [];

  async ngOnInit() {
    await this.getCustomers()
    await this.getTables()
    await this.getAllReservation()
  }

  reservations: Array<any> = []
  selectedReservation?: string

  onSelect(reservation: any): void {
    this.selectedReservation = reservation.reservationId
  }

  async getAllReservation() {
    this.reservationService.getAllReservation()
      .subscribe(result => {
        this.reservations = result.payload
        if (Array.isArray(this.reservations)) {
          for (let reservation of this.reservations) {
            reservation.tableLabel = this.getTableLabel(reservation.tableId)
            reservation.customerName = this.getCustomerName(reservation.customerId)
          }
        }
        this.loading = false
      })
  }

  async getTables() {
    this.tableService.getAllTables()
      .subscribe(result => {
        this.tables = result.payload
        this.loading = false;
      });
  }

  async getCustomers() {
    this.customerService.getCustomers()
      .subscribe(result => {
        this.customers = result.payload
        this.loading = false;
      });
  }

  getTableLabel(id: any) {
    let table = this.tables.find((table: any) => table.tableId === id);
    if (table) return table.tableLabel
    return null;
  }

  getCustomerName(id: any) {
    let customer = this.customers.find((customer: any) => customer.customerId === id);
    if (customer) return customer.customerName
    return null;
  }


  clear(table: Table) {
    table.clear();
  }

}
