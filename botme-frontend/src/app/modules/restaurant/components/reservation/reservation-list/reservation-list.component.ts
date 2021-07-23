import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ReservationService } from "../../../service/reservation.service";

@Component({
  selector: 'app-corpus-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  constructor(private reservationService: ReservationService) {
  }
  loading: boolean = true;

  ngOnInit(): void {
    this.getAllReservation()
  }

  reservations: Array<any> = []
  selectedReservation?: string

  onSelect(reservation: any): void {
    this.selectedReservation = reservation.reservationId
  }

  getAllReservation(): void {
    this.reservationService.getAllReservation()
      .subscribe(result => {
        this.reservations = result.payload
        this.loading = false
      })
  }
  clear(table: Table) {
    table.clear();
  }

}
