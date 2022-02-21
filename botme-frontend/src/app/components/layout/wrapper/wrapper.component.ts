import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../../../services/header.service";

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit {

  private readonly publicKey = "BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA"

  constructor(public headerService: HeaderService) {
  }

  ngOnInit(): void {
    this.allowNotification()
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
      this.regWorker().catch((err) => {
        console.error(err);
      });
    }
    else {
      alert("please allow notifications.");
    }
  }
  async regWorker() {
    // const publicKey = "BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA"
    if ('serviceWorker' in navigator){
      const register = navigator.serviceWorker.register('/sw.js',{scope: '/'})
      
      console.log("service woker register", register)

      const subscription = await (await register).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.publicKey
      });

      console.log("push register")

      await fetch('http://localhost:3100/notification/order',{
        method:'POST',
        body: JSON.stringify(subscription),
        headers: {
          'content-type': 'application/json'
        }
      });
    }
   
  }
}
