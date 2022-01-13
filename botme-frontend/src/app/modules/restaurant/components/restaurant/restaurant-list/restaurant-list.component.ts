import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { RestaurantService } from '../../../service/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {

  constructor(private restaurantService: RestaurantService, private _router: Router, private route: ActivatedRoute) { }

  loading = true;

  ngOnInit(): void {
    this.getRestaurants();
  }

  restaurants: Array<any> = [];

  navigateToAddCustomer() {
    this._router.navigate(['add-customer'], { relativeTo: this.route })
  }
  getRestaurants(): void {
    this.restaurantService.getRestaurants()
      .subscribe(result => {
        this.restaurants = result.payload
        this.loading = false;
      });
  }

  clear(table: Table) {
    table.clear();
  }
}
