import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../services/signup.service';
import {  FormControl, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  constructor(private user: SignupService) {
  }

  addUser= new FormGroup({
    userId: new FormControl('sami'),
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

  saveData(){
   console.log(this.addUser.value);
   this.user.saveUserData(this.addUser.value).subscribe(result => {
     console.log(result);
   })
  }
  
     
  }

  
