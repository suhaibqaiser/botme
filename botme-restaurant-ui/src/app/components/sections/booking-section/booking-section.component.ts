import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

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

  constructor() {
  }

  ngOnInit(): void {
  }

  addReservation() {
    console.log('reservation form =>', this.reservationForm.value)
  }
}
