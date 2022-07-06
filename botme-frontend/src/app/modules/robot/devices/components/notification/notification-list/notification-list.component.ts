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
    dropdownvalue : any
    event:any
    type: any=[]
    selecteType: any
    select:any
    value1:any
    checked: any


    constructor(private wc :WrapperComponent,private ns:NotificationService) {}

    ngOnInit(): void {
      this.checked = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
      this.event = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
      // localStorage.setItem("inputSwitch",JSON.stringify(this.checked))
      console.log("taha",localStorage.getItem("inputSwitch"))
      localStorage.setItem("dropDownValue","Order")
      this.dropdownvalue = localStorage.getItem("dropDownValue")
      this.value1 = localStorage.getItem("timeKey");

      this.setTime()

      this.type = [
        {name: "Order"},
        {name: "Summary"}
      ]
      this.selecteType = this.type
      let Switch = document.getElementById("inputSwitch")?.innerHTML
      console.log("Result ==>" ,Switch)

     }

    handleChange(e:any){
      let bool = e.checked
      let result = localStorage.setItem("inputSwitch",JSON.stringify(bool))
      // this.checked = localStorage.getItem("inputSwitch")
      this.event = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
      console.log("result==>",result)
      this.wc.regWorker()
      console.log(this.selecteType)
    }
    testNotification(){
      this.ns.testNotification().subscribe()

    }
    dropDown(dd:any){
      console.log(dd)
      localStorage.setItem("dropDownValue",dd.value.name)
      this.select = localStorage.getItem("dropDownValue")
      console.log(this.select)
      this.wc.notificationType(this.select)
      let value = localStorage.getItem("timeKey")
      this.ns.SetSummaryTime(value).subscribe()
    }
    setTime(){
      localStorage.setItem("timeKey",this.value1);
      let value = localStorage.getItem("timeKey")
      console.log(value)
      this.ns.SetSummaryTime(value).subscribe()
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

