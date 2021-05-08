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
    let title = this.router.routerState.snapshot.url.split('/')[1]
    return title.replace(title[0], title[0].toUpperCase());
  }
}
