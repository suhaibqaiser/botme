import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HelperService } from 'src/app/services/helper.service';



@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(private router: Router, private actRouter: ActivatedRoute, public _helperService: HelperService) {
  }
  breadcrumbs: [string] = ['']

 
  ngOnInit(): void {

    let url = this.router.routerState.snapshot.url.split('?')[0]
    let titleSplit = url.split('/')
    let title = ''
    for (let t in titleSplit) {

      if (Number(t) != 0) {
        this.breadcrumbs.push(this.titleCase(titleSplit[t]))
        if (Number(t) != titleSplit.length - 1) {
          title = title + ' / '
        }
      }
    }
  }

  titleCase(str: string) {
    let string = str.toLowerCase().split(' ');
    for (let i = 0; i < string.length; i++) {
      string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
    }
    return string.join(' ');
  }

}
