import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HelperService} from "./helper.service";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  apiBaseUrl = environment.apiRestaurantUrl;


  reservationForm = new FormGroup({
    customerName: new FormControl('', Validators.required),
    reservationSeats: new FormControl('', Validators.required),
    reservationDate: new FormControl('', Validators.required),
    reservationTime: new FormControl('', Validators.required),
  })

  reservationFormFocus: any = {
    customerNameFocus: true,
    reservationSeatsFocus: false,
    reservationDateFocus: false,
    reservationTimeFocus: false
  }
  conversationId: any = ''

  constructor(private http: HttpClient, private _helperService: HelperService) {
  }


  getReservationFormJson() {
    return [
      {
        "entityId": "entityId-name",
        "entityValue": this.reservationForm.get('customerName')?.value,
        "entityStatus": this.reservationFormFocus.customerNameFocus
      },
      {
        "entityId": "entityId-number-of-persons",
        "entityValue": this.reservationForm.get('reservationSeats')?.value,
        "entityStatus": this.reservationFormFocus.reservationSeatsFocus
      },
      {
        "entityId": "entityId-date",
        "entityValue": this.reservationForm.get('reservationDate')?.value,
        "entityStatus": this.reservationFormFocus.reservationDateFocus
      },
      {
        "entityId": "entityId-time",
        "entityValue": this.reservationForm.get('reservationTime')?.value,
        "entityStatus": this.reservationFormFocus.reservationTimeFocus
      }
    ]
  }

  //Todo: should pick entityValue on the basis of entityID

  setReservationForm(conversationId: any, reservationFormJson: any) {
    this.conversationId = conversationId
    reservationFormJson.forEach((item: any) => {
      if (item.entityId === 'entityId-name') {
        this.reservationForm.get('customerName')?.setValue(item.entityValue)
        this.reservationFormFocus.customerNameFocus = item.entityStatus
      }
      if (item.entityId === 'entityId-number-of-persons') {
        this.reservationForm.get('reservationSeats')?.setValue(item.entityValue)
        this.reservationFormFocus.reservationSeatsFocus = item.entityStatus
      }
      if (item.entityId === 'entityId-date') {
        this.reservationForm.get('reservationDate')?.setValue(item.entityValue)
        this.reservationFormFocus.reservationDateFocus = item.entityStatus
      }
      if (item.entityId === 'entityId-time') {
        this.reservationForm.get('reservationTime')?.setValue(this._helperService.timeConvert(item.entityValue))
        this.reservationFormFocus.reservationTimeFocus = item.entityStatus
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
    const url = `${this.apiBaseUrl}/food/reservation/add`;
    return this.http.put(url, {reservation: payload});
  }

  isRequired(value: any) {
    return !(value && value.length)
  }

  isNumberRequired(value: any) {
    return !(value && value > 0)
  }

  isDateRequired(value: any) {
    return !(value)
  }

  checkIsValidTime(value: any) {
    let pattern = new RegExp('^(0?[1-9]|1[0-2]):([0-5]\\d)\\s?((?:[Aa]|[Pp])\\.?[Mm]\\.?)$');
    return pattern.test(value)
  }
}
