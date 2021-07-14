import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Reservation } from '../../../model/reservation';
import { ReservationService } from '../../../service/reservation.service';

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.css']
})
export class ReservationDetailComponent implements OnInit {

  constructor(private reservationService: ReservationService, private route: ActivatedRoute) { }

  reservation?: Reservation | any
  reservationId?: string
  formMode = 'update'

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
  }

  findReservation(rId: string) {
    this.reservationService.findReservation(rId).subscribe(
      result => {
        this.reservation = result.payload
        console.log(this.reservation)
      }
    )
  }

  saveChanges() {}
}
