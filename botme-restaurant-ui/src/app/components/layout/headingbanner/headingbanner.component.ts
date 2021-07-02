import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-headingbanner',
  templateUrl: './headingbanner.component.html',
  styleUrls: ['./headingbanner.component.scss']
})
export class HeadingbannerComponent implements OnInit {

  currentRoute: string = "";

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url.replace(/\//g, "").replace("-"," ");
  }

}
