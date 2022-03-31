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

  private readonly publicKey = "BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA"

  register:any
  e:any
  type:any

  constructor(public headerService: HeaderService,private authservice:AuthenticationService) {
  }

  apiBaseUrl = environment.apiRestaurantUrl;

  ngOnInit(): void {
    // localStorage.setItem("inputSwitch",JSON.stringify(true))
    // this.e = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
    // console.log("e=>",this.e)
    this.type = JSON.parse(localStorage.getItem("dropDownValue") || '{}')
    this.allowNotification()
  }
  // notificationType(type:any){
  //   if(this.type != type){
  //     this.type = type
  //     this.regWorker(true)
  //     console.log("notification type changed")
  //   }
  // }
  allowNotification(){
    if (Notification.permission === 'default'){
      Notification.requestPermission().then((perm) => {
        if (Notification.permission === "granted"){
            this.regWorker(this.e).catch((err) => {
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
      this.regWorker(this.e).catch((err) => {
        console.error(err);
      });
    }
    else {
      alert("please allow notifications.");
    }
  }
  async regWorker(e:any) {
    if ('serviceWorker' in navigator){
      this.register = navigator.serviceWorker.register('/sw.js',{scope: '/'})
      let subscription = await (await this.register).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.publicKey
      });

      console.log(this.type)

      var subscriptionWrapper = {
        "subscription":subscription,
        "notificationType":this.type,
        
      }

      if (e == true){
      console.log("subscribed")
      await fetch(this.apiBaseUrl + '/notification/subscribe',{
        method:'POST',
        body: JSON.stringify(subscriptionWrapper),
        headers: {
          'content-type': 'application/json'
        }
      });
      }
      else{
        console.log("unsubscribed")
        await fetch(this.apiBaseUrl + '/notification/unsubscribe',{
          method:'POST',
          body: JSON.stringify(subscriptionWrapper),
          headers: {
            'content-type': 'application/json'
          }
        });
      }
    } 
  
  // async unregWorker(){
  //   let subscription = await (await this.register).pushManager.subscribe({
  //     userVisibleOnly: true,
  //     applicationServerKey: this.publicKey
  //   });
  //   await fetch(this.apiBaseUrl + '/notification/unsubscribe',{
  //   method:'POST',
  //   body: JSON.stringify(subscription),
  //   headers: {
  //     'content-type': 'application/json'
  //   }
  // });
    // this.register.unregister()
    // const reg = await navigator.serviceWorker.register('/sw.js',{scope: '/'})
    // const subscription = {"endpoint":"remove"}
    // await fetch(this.apiBaseUrl + '/notification/subscribe',{
    //   method:'POST',
    //   body: JSON.stringify(subscription),
    //   headers: {
    //     'content-type': 'application/json'
    //   }
    // });
    // await (await reg).unregister()
    // console.log("service worker unregistered")

  }
 
  // fetchNotification(subscription:any){

  //   fetch('http://localhost:3100/notification/subscribe',{
  //   method:'POST',
  //   body: JSON.stringify(subscription),
  //   headers: {
  //     'content-type': 'application/json'
  //   }
  //     });
  // }
// }
}
