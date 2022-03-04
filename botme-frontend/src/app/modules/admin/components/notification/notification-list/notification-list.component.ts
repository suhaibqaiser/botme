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

    // private readonly publicKey = "BDCQVQ8eDIxkBtTKyu98APMWTQ_HNA5PrRL7XVac7U-GuPJBikGFJguHGC5dAd7BULCkTpyfuvN3Ns57SamWkpA"
    // selectedCity: select=[] 
    orders: any=[]
    result: any
    size : any
    event:boolean=false
    type: any=[]
    selecteType: any
    select:any

    constructor(private wc :WrapperComponent,private ns:NotificationService) {}
    
    ngOnInit(): void {
      this.type = [
        {name: "Order"},
        {name: "Summary"}
      ]
      this.selecteType = this.type
      
      // this.handleChange(this.checked)
     }

    handleChange(e:any){
      var isChecked = e.checked;
      console.log(isChecked)
      this.wc.regWorker(isChecked)
      console.log(this.selecteType)
      if (e.checked == true){
        this.event = true 
      }
      else{
        this.event = false
      }
    }
    testNotification(){
      this.ns.testNotification().subscribe()

    }
    dropDown(dd:any){
      this.select = dd.value.name
      this.wc.notificationType(this.select)   
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
  
  