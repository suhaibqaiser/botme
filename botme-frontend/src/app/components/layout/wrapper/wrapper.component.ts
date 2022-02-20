import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../../../services/header.service";
import {SwPush} from '@angular/service-worker'
import { NotificationService } from 'src/app/modules/admin/service/notification.service';
import {ServiceWorker} from 'src/app/services/service-worker.service'

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {
  
  private readonly publicKey = "BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA"

  constructor(public headerService: HeaderService,private ns: NotificationService ,private sw: ServiceWorker) {
  }
  size:any
  orders:any

  ngOnInit(): void {
    this.allowNotification()
  }

  allowNotification() {
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
      this.regWorker().catch((err) => {
        console.error(err);
      });
    }
    else {
      alert("please allow notifications.");
    }
   
  }
  showNotification(){
    console.log("taha")
    console.log("taha")
      this.ns.getOrders()
      .subscribe((data)=>{
        if (data.status === 'success'){
          this.orders = data.payload;
          this.size = this.orders.length
          console.log(this.size)
          this.Notification()
        }
      });
  }

  Notification(){
    if (Notification.permission === 'granted'){
       const notification = new Notification("Order Summary",{
       body: this.size + " order placed in 10 second" 
        });
    }
    else if (Notification.permission !== 'denied'){
      Notification.requestPermission().then(permission =>{
          const notification = new Notification("Order Summary",{
          body: this.size + " order placed in 10 second"
          });
      });
    }
  }
  async regWorker() {
    // const publicKey = "BDjWHkVcRTtTiCJ97CAvOWrsQHfZlXWsl0zkFd352EmeEkfp6bZv-Rt54ZWIVdhJuZyTDjvf3hF567sfyYLKJ-0"
    if ('serviceWorker' in navigator){
      const register = navigator.serviceWorker.register('/sw.js',{scope: '/'})
      
      console.log("service woker register", register)

      const subscription = await (await register).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.publicKey
      });

      console.log("push register")

      await fetch('http://localhost:3100/order/notification',{
        method:'POST',
        body: JSON.stringify(subscription),
        headers: {
          'content-type': 'application/json'
        }
      });

    }
   
  }
}

