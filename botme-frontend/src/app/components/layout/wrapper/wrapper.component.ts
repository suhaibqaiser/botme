import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../../../services/header.service";

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {

  constructor(public headerService: HeaderService) {
  }

  ngOnInit(): void {
  }


}
