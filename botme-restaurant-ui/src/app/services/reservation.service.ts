import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HelperService} from "./helper.service";
import {BotmeClientService} from "./botme-client.service";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  apiBaseUrl = environment.apiRestaurantUrl;


  reservationForm = new FormGroup({
    customerName: new FormControl('', [Validators.required, this.checkCustomerName]),
    reservationSeats: new FormControl('', [Validators.required, this.checkReservationSeats]),
    reservationDate: new FormControl('', [Validators.required, this.checkReservationDate]),
    reservationTime: new FormControl('', [Validators.required, this.checkReservationTime]),
  })

  reservationFormFocus: any = {
    customerNameFocus: true,
    reservationSeatsFocus: false,
    reservationDateFocus: false,
    reservationTimeFocus: false
  }
  conversationId: any = ''

  constructor(private _clientService: BotmeClientService, private http: HttpClient, public _helperService: HelperService) {
  }


  checkCustomerName(control: { value: any; }) {
    const enteredName = control.value;
    const nameCheck = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return (!nameCheck.test(enteredName) && enteredName) ? {requirements: true} : null;
  }

  checkReservationSeats(control: { value: any; }) {
    const reservationSeats = control.value;
    return (!(reservationSeats && reservationSeats > 0)) ? {requirements: true} : null;
  }

  checkReservationDate(control: { value: any; }) {
    const reservationDate = control.value;
    return (!(reservationDate)) ? {requirements: true} : null;
  }

  checkReservationTime(control: { value: any; }) {
    const reservationTime = control.value;
    const reservationTimeCheck = new RegExp('^(0?[1-9]|1[0-2]):([0-5]\\d)\\s?((?:[Aa]|[Pp])\\.?[Mm]\\.?)$');
    return (!reservationTimeCheck.test(reservationTime) && reservationTime) ? {requirements: true} : null;
  }

  getError(formControlName: any) {
    if (formControlName === 'customerName') {
      return this.reservationForm.get(formControlName)?.hasError('required') ?
        'Name is required!' :
        this.reservationForm.get(formControlName)?.hasError('requirements') ?
          'Name should have only characters!' : '';
    }

    if (formControlName === 'reservationSeats') {
      return this.reservationForm.get(formControlName)?.hasError('required') ? 'Number of seats are required!' : ''
    }

    if (formControlName === 'reservationDate') {
      return this.reservationForm.get(formControlName)?.hasError('required') ? 'Reservation Date is required!' : ''
    }

    if (formControlName === 'reservationTime') {
      return this.reservationForm.get('reservationTime')?.hasError('required') ?
        'Time is required' :
        this.reservationForm.get('reservationTime')?.hasError('requirements') ?
          'Please enter valid time format (12:30 pm)!' : '';
    }
    return ''
  }


  getReservationFormJson() {
    return [
      {
        "entityId": "entityId-name",
        "entityValue": this.reservationForm.get('customerName')?.value,
        "entitySelected": this.reservationFormFocus.customerNameFocus
      },
      {
        "entityId": "entityId-number-of-persons",
        "entityValue": this.reservationForm.get('reservationSeats')?.value,
        "entitySelected": this.reservationFormFocus.reservationSeatsFocus
      },
      {
        "entityId": "entityId-date",
        "entityValue": this.reservationForm.get('reservationDate')?.value,
        "entitySelected": this.reservationFormFocus.reservationDateFocus
      },
      {
        "entityId": "entityId-time",
        "entityValue": this.reservationForm.get('reservationTime')?.value,
        "entitySelected": this.reservationFormFocus.reservationTimeFocus
      }
    ]
  }

  //Todo: should pick entityValue on the basis of entityID

  setReservationForm(conversationId: any, reservationFormJson: any) {
    this.conversationId = conversationId
    if (!reservationFormJson.length) return
    reservationFormJson.forEach((item: any) => {
      if (item.entityId === 'entityId-name') {
        this.reservationForm.get('customerName')?.setValue(item.entityValue)
        this.reservationFormFocus.customerNameFocus = item.entitySelected
      }
      if (item.entityId === 'entityId-number-of-persons') {
        this.reservationForm.get('reservationSeats')?.setValue(item.entityValue)
        this.reservationFormFocus.reservationSeatsFocus = item.entitySelected
      }
      if (item.entityId === 'entityId-date') {
        this.reservationForm.get('reservationDate')?.setValue(item.entityValue)
        this.reservationFormFocus.reservationDateFocus = item.entitySelected
      }
      if (item.entityId === 'entityId-time') {
        this.reservationForm.get('reservationTime')?.setValue(this._helperService.timeConvert(item.entityValue))
        this.reservationFormFocus.reservationTimeFocus = item.entitySelected
      }
    })
  }

  setFocusOnField(keyId = '') {
    if (this.conversationId.length) {
      this.conversationId = ''
      return
    }
    for (let key in this.reservationFormFocus) {
      if (this.reservationFormFocus.hasOwnProperty(key)) {
        this.reservationFormFocus[key] = (key === keyId)
      }
    }
  }

  addReservation(payload: any): Observable<any> {
    const url = `${this.apiBaseUrl}/food/reservation/add?restaurantId=` + this._helperService.getRestaurantIdOnAuthBasis();
    return this.http.put(url, {reservation: payload});
  }

  generateTableNumber() {
    let number = Math.floor(Math.random() * 15)
    return (number >= 1) ? number : 1
  }

  resetFocus() {
    this.reservationFormFocus = {
      customerNameFocus: true,
      reservationSeatsFocus: false,
      reservationDateFocus: false,
      reservationTimeFocus: false
    }
  }

  resetReservationForm() {
    this.reservationForm.get('customerName')?.setValue('')
    this.reservationForm.get('reservationSeats')?.setValue('')
    this.reservationForm.get('reservationDate')?.setValue('')
    this.reservationForm.get('reservationTime')?.setValue('')
  }
}
