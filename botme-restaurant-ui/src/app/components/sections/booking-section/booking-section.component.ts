import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SocketService} from "../../../services/socket.service";
import {ReservationService} from "../../../services/reservation.service";
import {Router} from "@angular/router";
import {HelperService} from "../../../services/helper.service";
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
  reservationForm = new FormGroup({
    customerName: new FormControl('', Validators.required),
    reservationSeats: new FormControl('', Validators.required),
    reservationDate: new FormControl('', Validators.required),
    reservationTime: new FormControl('', Validators.required),
  })
  validations: any = {
    customerName: false,
    reservationSeats: false,
    reservationDate: false,
    reservationTime: false,
    isValidTime: false,
  }
  reservationLoader: boolean = false

  /// Time regex ^(0?[1-9]|1[0-2]):([0-5]\d)\s?((?:A|P)\.?M\.?)$
  constructor(private _botMeClientService: BotmeClientService, private _helper: HelperService, private _router: Router, private _reservationService: ReservationService, public _socketService: SocketService) {
    this.resetReservation()
    clearTimeout(this._helper.timer)
  }

  ngOnInit(): void {
    this._socketService.getCurrentContext()
  }

  addReservation() {
    // @ts-ignore
    let name = document.getElementById('entityId-name')?.value
    if (name && name.length) {
      this.reservationForm.get('customerName')?.setValue(name)
    }
    // @ts-ignore
    let number_of_person = document.getElementById('entityId-number-of-persons')?.value
    if (number_of_person && number_of_person.length) {
      this.reservationForm.get('reservationSeats')?.setValue(parseInt(number_of_person))
    }
    // @ts-ignore
    let date = document.getElementById('entityId-date')?.value
    if (date && date.length) {
      this.reservationForm.get('reservationDate')?.setValue(date)
    }
    // @ts-ignore
    let time = document.getElementById('entityId-time')?.value
    if (time && time.length) {
      this.reservationForm.get('reservationTime')?.setValue(time)
    }


    console.log('reservation form =>', this.reservationForm.value)
    this.validations.customerName = this._reservationService.isRequired(this.reservationForm.get('customerName')?.value)
    this.validations.reservationSeats = this._reservationService.isNumberRequired(this.reservationForm.get('reservationSeats')?.value)
    this.validations.reservationDate = this._reservationService.isDateRequired(this.reservationForm.get('reservationDate')?.value)
    this.validations.reservationTime = this._reservationService.isRequired(this.reservationForm.get('reservationTime')?.value)
    if (!this.validations.reservationTime) this.validations.isValidTime = !this._reservationService.checkIsValidTime(this.reservationForm.get('reservationTime')?.value)

    if (Object.keys(this.validations).every(k => this.validations[k] === false)) {
      this.reservationLoader = true
      this._reservationService.addReservation(this.reservationForm.value).subscribe((res: any) => {
          if (res.status === "success") {
            this.reservation = {
              isReservationCompleted: true,
              tableNumber: this.generateTableNumber(),
              name: this.reservationForm.get('customerName')?.value,
              reservationSeats: this.reservationForm.get('reservationSeats')?.value,
              reservationDate: this.reservationForm.get('reservationDate')?.value,
              reservationTime: this.reservationForm.get('reservationTime')?.value,
            }
            this.reservationLoader = false
            this._helper.timer = setTimeout(() => {
              if (this._socketService.getCurrentRoute() === 'reservations') this._router.navigate(['home'])
              this.reservation.isReservationCompleted = false
            }, 10000)
          }
        }
      )
    }
  }

  resetReservation() {
    this.reservationForm.reset()
    this.reservation = {
      isReservationCompleted: false,
      name: null,
      reservationSeats: null,
      reservationDate: null,
      reservationTime: null
    }
  }

  generateTableNumber() {
    let number = Math.floor(Math.random() * 15)
    return (number >= 1) ? number : 1
  }

  setFocusOnField(entityId: any) {
    if (!this._botMeClientService.getCookie().isLoggedIn) return
    this._socketService.reservationFormEntities.forEach((item: any) => {
      item.entityStatus = item.entityId === entityId
    })
  }
}
