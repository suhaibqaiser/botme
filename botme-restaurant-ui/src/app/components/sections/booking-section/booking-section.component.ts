import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SocketService} from "../../../services/socket.service";
import {ReservationService} from "../../../services/reservation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-booking-section',
  templateUrl: './booking-section.component.html',
  styleUrls: ['./booking-section.component.scss']
})
export class BookingSectionComponent implements OnInit {
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
    reservationTime: false
  }

  constructor(private _router: Router, private _reservationService: ReservationService, private _socketService: SocketService) {
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

    if (Object.keys(this.validations).every(k => this.validations[k] === false)) {
      this._reservationService.addReservation(this.reservationForm.value).subscribe((res: any) => {
          if (res.status === "success") {
            this._router.navigate(['/online-shop'])
          }
        }
      )
    }
  }
}
