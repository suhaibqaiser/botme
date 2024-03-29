import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {ReservationService} from "../../../services/reservation.service";
import {Router} from "@angular/router";
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";

@Component({
  selector: 'app-booking-section',
  templateUrl: './booking-section.component.html',
  styleUrls: ['./booking-section.component.scss']
})
export class BookingSectionComponent implements OnInit {
  reservation: any = {
    isReservationCompleted: false,
    name: null,
    tableNumber: 0,
    reservationSeats: null,
    reservationDate: null,
    reservationTime: null
  }
  reservationLoader: boolean = false

  constructor(private _contextService: ContextService, private _helper: HelperService, private _router: Router, public _reservationService: ReservationService, public _socketService: SocketService) {
    clearTimeout(this._helper.timer)
    this._reservationService.reservationForm.reset()
    this._reservationService.resetFocus()
  }

  ngOnInit(): void {
    this._contextService.getCurrentContext()
  }

  addReservation() {
    this.reservationLoader = true
    this._reservationService.addReservation(this._reservationService.reservationForm.value).subscribe((res: any) => {
        if (res.status === "success") {
          this.reservation = {
            isReservationCompleted: true,
            tableNumber: this._reservationService.generateTableNumber(),
            name: this._reservationService.reservationForm.get('customerName')?.value,
            reservationSeats: this._reservationService.reservationForm.get('reservationSeats')?.value,
            reservationDate: this._reservationService.reservationForm.get('reservationDate')?.value,
            reservationTime: this._reservationService.reservationForm.get('reservationTime')?.value,
          }
          this._reservationService.reservationForm.reset()
          this.reservationLoader = false
          this._helper.timer = setTimeout(() => {
            if (this._helper.getCurrentRouteName() === '/reservations') this._router.navigate(['home'])
            this.reservation.isReservationCompleted = false
          }, 10000)
        }
      }
    )
  }

  resetReservation() {
    this.reservation = {
      isReservationCompleted: false,
      name: null,
      reservationSeats: null,
      reservationDate: null,
      reservationTime: null
    }
  }
}
