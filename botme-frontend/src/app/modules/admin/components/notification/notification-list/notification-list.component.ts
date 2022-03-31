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
    value1:any = "1"
    checked: any
    checkSwitchValue:any


    constructor(private wc :WrapperComponent,private ns:NotificationService) {}
    
    ngOnInit(): void {

      this.checkSwitchValue = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
      this.handleChange(this.checkSwitchValue)
      
      // this.checked = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
      // this.event = JSON.parse(localStorage.getItem("inputSwitch") || '{}')

      // localStorage.setItem("inputSwitch",JSON.stringify(this.checked))
      // localStorage.setItem("dropDownValue","Order")

      this.setTime()
      // this.value1 = JSON.parse(localStorage.getItem("timeKey") || '{}');

      this.type = [
        {name: "Order"},
        {name: "Summary"}
      ]
      this.dropdownvalue = JSON.parse(localStorage.getItem("dropDownValue") || '{}')
      // this.selecteType = {name: this.dropdownvalue}
      // this.select = {name: "Order"}
      // this.select = this.dropdownvalue


      // this.type = [
      //   {name: "Order"},
      //   {name: "Summary"}
      // ]
     }

    handleChange(e:any){
      if(e==""){
        console.log("by default true")
        localStorage.setItem("inputSwitch",JSON.stringify(true))
        this.checked = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
        this.event = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
        this.checkSwitchValue = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
        this.wc.regWorker(this.checkSwitchValue)
      }
      else{
        if(e.checked==Boolean){
          console.log("switch change event")
          let bool = e.checked
          localStorage.setItem("inputSwitch",JSON.stringify(bool))
          this.checked = e.checked
          this.event = e.checked
          this.wc.regWorker(e.checked)
        }
        else{
          console.log("local storage switch value")
          this.checked = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
          this.event = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
          this.checkSwitchValue = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
          this.wc.regWorker(this.checkSwitchValue)
        }
      }
    }
    testNotification(){
      this.ns.testNotification().subscribe()

    }
    dropDown(dd:any){
      // localStorage.setItem()
      if (dd.value.name == ""){
        // localStorage.setItem("dropDownValue","Order")
        alert("Notification Type Required")
      }
      else{
        localStorage.setItem("dropDownValue",dd.value.name)
        let value = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
        this.wc.regWorker(value)
        this.select = dd.value.name
      }
      // this.wc.notificationType(this.select)
      // let value = localStorage.getItem("timeKey")
      // if(this.select=="Summary"){
      //   this.ns.SetSummaryTime(value).subscribe()
      // }
    }
    setTime(){
      localStorage.setItem("timeKey",JSON.stringify(this.value1));
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
  
  