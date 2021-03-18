import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle: string = '';

  constructor(route: ActivatedRoute) {
    const Title: Observable<string> = route.data.pipe(map(d => this.pageTitle = d.pageTitle));
  }
}
