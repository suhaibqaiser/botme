import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";



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

    let titleSplit = this.router.routerState.snapshot.url.split('/')
    let title = ''
    for (let t in titleSplit) {
      if (Number(t) != 0) {
        title = title + this.titleCase(titleSplit[t])
        if (Number(t) != titleSplit.length-1) {
          title = title + ' / '
        }
      }
    }
    return title;
  }

  titleCase(str: string) {
    let string = str.toLowerCase().split(' ');
    for (let i = 0; i < string.length; i++) {
      string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
    }
    return string.join(' ');
  }
}
