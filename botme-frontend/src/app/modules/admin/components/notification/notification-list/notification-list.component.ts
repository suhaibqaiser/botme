import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../service/notification.service';
import { WrapperComponent } from 'src/app/components/layout/wrapper/wrapper.component';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.css']
  })
  export class NotificationListComponent implements OnInit {

    orders: any=[]
    result: any
    size : any

    constructor(private notificationService: NotificationService, private wrapper: WrapperComponent) { }
  
    ngOnInit(): void {
     }
    getSummary() {
      // console.log("taha")
      // this.notificationService.getOrders()
      // .subscribe((data)=>{
      //   if (data.status === 'success'){
      //     this.orders = data.payload;
      //     this.size = this.orders.length
      //     console.log(this.size)
          this.wrapper.showNotification()
          setTimeout(() => {
            this.getSummary()
          }, 10000);
          // this.showNotification()
        }
    }
    // getOrders() {
    //   console.log("taha")
    //   this.result = this.notificationService.getOrders()
    //   this.result = this.result.subscribe()
    //   console.log(this.result)
    //   if (this.result.status === 'success'){
    //     console.log("taha0.5")
    //     this.orders = this.result.payload
    //     this.size = this.orders.length
    //     console.log(this.size)
    //     this.showNotification();
    //   }
    // }
    // showNotification(){
    //   console.log("taha1")
    //   const notification = new Notification("Order Summary",{
    //     body: this.size + " order placed in 30 second" 
    //   });
    // }
    // Notification(){
    //   if (Notification.permission === 'granted'){
    //     this.showNotification();
    //   }else if (Notification.permission !== 'denied'){
    //     Notification.requestPermission().then(permission =>{
    //       this.showNotification();
    //     });
    //   }
    // }
  
  