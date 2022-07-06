import { Component, OnInit } from '@angular/core';
// import { NotificationService } from '../../../service/notification.service';
import { WrapperComponent } from 'src/app/components/layout/wrapper/wrapper.component';
import { NotificationService } from '../../../service/notification.service';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.css']
  })
  
  
  export class NotificationListComponent implements OnInit {

    constructor(private wc :WrapperComponent,private ns:NotificationService) {}

    SelectType: any = "Order"
    checked: boolean = true
    NotificationType: any =["Order","Summary"]

    ngOnInit(): void {
      this.retrieveLocalStorgeValue()
    }

    handleChange(e:any){
      localStorage.setItem("inputSwitch",e.checked)

      if (e.checked == true){
        this.wc.regWorker()
      }

      if (e.checked == false){
        this.wc.unregWorker()
      }

    }

    dropDown(dd:any){
      localStorage.setItem("dropDownValue",dd.value)
      this.wc.setNotificationType(this.SelectType)
      // this.ns.SetSummaryTime(value).subscribe()
    }

    testNotification(){
      this.ns.testNotification().subscribe()
    }


    setTime(){
      this.ns.SetSummaryTime().subscribe()
    }

    retrieveLocalStorgeValue(){
      this.SelectType = JSON.parse(localStorage.getItem("dropDownValue")|| '{}')
      this.checked = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
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
  
  