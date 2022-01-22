import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";
import {UserService} from "../../../modules/admin/service/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  restaurantList: any = []
  restaurantObj:any = {}
  constructor(private userService: UserService, public headerService: HeaderService, private authService: AuthenticationService, private router: Router) {
  }

  userFullName: string | null = ''

  async ngOnInit()  {
    this.userFullName = localStorage.getItem('userFullName')
    await this.getRestaurants()
  }


  userlogout() {
    this.authService.userLogout();
    this.router.navigate(['/login'])
  }

  // After login sidebar toggle is not working for this will add class explicitly
  // in wrapper.component.html
  toggleSideBar() {
    this.headerService.getToggleObject().check = !this.headerService.getToggleObject().check
    this.headerService.getToggleObject().addClass = this.headerService.getToggleObject().check ? '' : 'is-folded'
  }

  async getRestaurants() {
    await this.userService.getRestaurants().subscribe(res => {
      const restaurantList = res.payload
      if(restaurantList && restaurantList.length) {
        this.restaurantObj = restaurantList.find((item:any) => item.restaurantId === this.authService.getRestaurantId())
      }
      return true
    })
  }
}
