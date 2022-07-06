import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../../../services/header.service";
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {environment} from 'src/environments/environment';


@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {

  private readonly publicKey = "BASpDNILoNMWYHhzrhEY6QKqFZqH8FOtybXu_3fqVk1lxbWNYU1VAmigQuN2u8lahgGOiW-FGHrWmrDwpbQ1-l0"

  register:any
  e:boolean=false
  notificationType:any 

  constructor(public headerService: HeaderService,private authservice:AuthenticationService) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  ngOnInit(): void {
    this.notificationType = localStorage.getItem("dropDownValue")
    this.allowNotification()
  }
  setNotificationType(type:any){
    this.notificationType = type
    this.regWorker()
    console.log("notification type changed")
    
  }
  allowNotification(){
    if (Notification.permission === 'default'){
      Notification.requestPermission().then((perm) => {
        if (Notification.permission === "granted"){
          this.regWorker().catch((err) => {
            console.error(err);
          });
        }
        else{
          alert("please allow notifications.");
        }
      });
    }
    else if (Notification.permission === "granted"){
      console.log("permission granted")
      this.regWorker().catch((err) => {
        console.error(err);
      });
    }
    else {
      alert("please allow notifications.");
    }
  }
  async regWorker() {
    if ('serviceWorker' in navigator){
      this.register = await navigator.serviceWorker.register('/sw.js',{scope: '/'}).catch((err) => {
        console.error("err==>",err)
      })
      let subscription = await (await this.register).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.publicKey
      });

      console.log("register==>",this.register)

      var subscriptionWrapper = {
        "subscription":subscription,
        "notificationType":this.notificationType,
        "restaurantId": localStorage.getItem("restaurantId")
      }
      await fetch(this.apiBaseUrl + '/notification/subscribe',{
        method:'POST',
        body: JSON.stringify(subscriptionWrapper),
        headers: {
          'content-type': 'application/json'
        }
      });
    } 
  }
  async unregWorker() {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
       registration.unregister()
      } })
  }  
}
