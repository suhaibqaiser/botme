import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  }
  isLoginFailed = false;
  errorMessage = '';
  loginToken = '';

  loginLoader = false
  loginFormValidations:any = {
    username: false,
    password: false
  }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.userLogin(this.form);
  }

  userLogin(user: any) {
    this.loginFormValidations.username = (!user.username)
    this.loginFormValidations.password = (!user.password)
    if(!Object.keys(this.loginFormValidations).every(k => this.loginFormValidations[k] == false)){
      return
    }

    this.loginLoader = true
    user.password = Md5.hashStr(user.password);
    this.authenticationService.userLogin(user).subscribe(
      response => {
        if (response.status === 'error') {
          this.loginLoader = false
          this.isLoginFailed = true
          this.errorMessage = response.payload
        } else {
          this.isLoginFailed = false
          this.loginLoader = false
          localStorage.setItem('loginToken', response.userToken)
          localStorage.setItem('userFullName', response.userFullName)
          localStorage.setItem('restaurantId', response.restaurantId)
          this.router.navigate(["/home"])

        }

      })
  }

}
