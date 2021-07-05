import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  userFullName: string | null = ''

  ngOnInit(): void {
    this.userFullName = localStorage.getItem('userFullName')
  }


  userlogout() {
    this.authService.userLogout();
    this.router.navigate(['/login'])
  }

}
