import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../../../services/header.service";
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {

  private readonly publicKey = "BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA"

  register:any

  constructor(public headerService: HeaderService) {
  }

  ngOnInit(): void {
    this.allowNotification()
  }
  allowNotification(){
    if (Notification.permission === 'default'){
      Notification.requestPermission().then((perm) => {
        if (Notification.permission === "granted"){
          this.regWorker(true).catch((err) => {
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
      // this.regWorker().catch((err) => {
      //   console.error(err);
      // });
    }
    else {
      alert("please allow notifications.");
    }
  }
  async regWorker(e:boolean) {
    if ('serviceWorker' in navigator){
        // var subscriptionWrapper = {
        //   "subscription":subscription,
        //   "settings":{
        //     "summary":"",
        //     "":""
        //   }
        // }
      if (e == true){
        this.register = navigator.serviceWorker.register('/sw.js',{scope: '/'})
        let subscription = await (await this.register).pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.publicKey
        });
        await fetch('http://localhost:3100/notification/subscribe',{
        method:'POST',
        body: JSON.stringify(subscription),
        headers: {
          'content-type': 'application/json'
        }
      });
      }
      else{
        this.unregWorker()
      }
    } 
  }
  async unregWorker(){
    const reg = await navigator.serviceWorker.register('/sw.js',{scope: '/'})
    const subscription = {"endpoint":"remove"}
    await fetch('http://localhost:3100/notification/subscribe',{
      method:'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json'
      }
    });
    await (await reg).unregister()
    console.log("service worker unregistered")

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
