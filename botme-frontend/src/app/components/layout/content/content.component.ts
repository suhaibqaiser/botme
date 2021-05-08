import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(private router: Router, private actRouter: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  getPageHeader(): String {
    return this.router.routerState.snapshot.url.split('/')[1].toUpperCase();
  }
}
