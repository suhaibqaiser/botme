import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../../services/authentication.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Md5 } from 'ts-md5/dist/md5';

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
    user.password = Md5.hashStr(user.password);
    this.authenticationService.userLogin(user).subscribe(
      response => {
        if (response.status === 'error') {
          this.isLoginFailed = true
          this.errorMessage = response.payload
        } else {
          this.isLoginFailed = false
          this.loginToken = response.payload.loginToken
          localStorage.setItem('loginToken', this.loginToken)
          localStorage.setItem('userFullName', response.payload.userFullName)
          this.router.navigate(["/home"])
        }

      })
  }

}
