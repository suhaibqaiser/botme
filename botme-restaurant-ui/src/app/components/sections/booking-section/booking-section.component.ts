import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {ReservationService} from "../../../services/reservation.service";
import {Router} from "@angular/router";
import {HelperService} from "../../../services/helper.service";
import {ContextService} from "../../../services/context.service";
import {BotmeClientService} from "../../../services/botme-client.service";

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

  constructor(private _botMeService: BotmeClientService, private _contextService: ContextService, private _helper: HelperService, private _router: Router, public _reservationService: ReservationService) {
    clearTimeout(this._helper.timer)
    this._reservationService.reservationForm.reset()
    this._reservationService.resetFocus()
  }

  ngOnInit(): void {
    this._contextService.getCurrentContext()
  }

  addReservation() {
    this.reservationLoader = true
    this.disableFormOnSubmit()
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
          this._botMeService.setCookie('reservationId',res.payload.reservationId)
          this._botMeService.setCookie('orderId',res.payload.orderId)
          this.enableForm()
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

  disableFormOnSubmit() {
    this._reservationService.reservationForm.get('customerName')?.disable()
    this._reservationService.reservationForm.get('reservationSeats')?.disable()
    this._reservationService.reservationForm.get('reservationDate')?.disable()
    this._reservationService.reservationForm.get('reservationTime')?.disable()
  }

  enableForm() {
    this._reservationService.reservationForm.get('customerName')?.enable()
    this._reservationService.reservationForm.get('reservationSeats')?.enable()
    this._reservationService.reservationForm.get('reservationDate')?.enable()
    this._reservationService.reservationForm.get('reservationTime')?.enable()
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
