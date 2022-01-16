import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {HeaderService} from "../../../services/header.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public headerService: HeaderService, private authService: AuthenticationService, private router: Router) {
  }

  userFullName: string | null = ''

  ngOnInit(): void {
    this.userFullName = localStorage.getItem('userFullName')
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

  getLocalStorageRestaurantId(){
    const id = localStorage.getItem('restaurantId')
    return id ? id.replace(/-/g, " ") : ''
  }
}
