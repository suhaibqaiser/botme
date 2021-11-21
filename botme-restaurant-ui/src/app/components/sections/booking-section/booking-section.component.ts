import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-booking-section',
  templateUrl: './booking-section.component.html',
  styleUrls: ['./booking-section.component.scss']
})
export class BookingSectionComponent implements OnInit {
  reservationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    number_of_person: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
  })

  constructor(private _socketService:SocketService) {
  }

  ngOnInit(): void {
    this._socketService.getCurrentContext()
  }

  addReservation() {
    // @ts-ignore
    let name = document.getElementById('entityId-name')?.value
    if(name && name.length){
      this.reservationForm.get('name')?.setValue(name)
    }
    // @ts-ignore
    let number_of_person = document.getElementById('number_of_person')?.value
    if(number_of_person && number_of_person.length){
      this.reservationForm.get('number_of_person')?.setValue(number_of_person)
    }
    // @ts-ignore
    let date = document.getElementById('date')?.value
    if(date && date.length){
      this.reservationForm.get('date')?.setValue(date)
    }
    // @ts-ignore
    let time = document.getElementById('time')?.value
    if(time && time.length){
      this.reservationForm.get('time')?.setValue(time)
    }

    console.log('reservation form =>', this.reservationForm.value)
  }
}
