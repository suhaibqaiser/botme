import {Component, OnInit} from '@angular/core';
import {SignupService} from '../../services/signup.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Md5} from "ts-md5";
import {Router} from "@angular/router";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  constructor(private user: SignupService, private router: Router) {
  }

  addUser = new FormGroup({
    userId: new FormControl(''),
    userName: new FormControl(''),
    userSecret: new FormControl(''),
    userFullName: new FormControl(''),
    userEmail: new FormControl(''),
    userCreated: new FormControl(''),
    restaurantId: new FormControl(''),
    userActive: new FormControl(true)
  });


  ngOnInit(): void {

  }

  saveData() {
    console.log(this.addUser.value);
    const userSecret = Md5.hashStr(this.addUser.get('userSecret')?.value)
    this.addUser.get('userSecret')?.setValue(userSecret)
    this.user.saveUserData(this.addUser.value).subscribe(result => {
      this.router.navigate(["/login"])
      console.log(result);
    })
  }


}


