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

  pageTitle: string;

  constructor(private router: Router, private actRouter: ActivatedRoute) {
    this.pageTitle = this.router.routerState.snapshot.url.split('/')[1].toUpperCase()
  }

  ngOnInit(): void {

  }
}
