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
      console.log("selectType==>",this.SelectType)
      console.log("checked==>",this.checked)

      this.wc.setNotificationType(this.SelectType)
      if (this.checked == true){
        this.wc.regWorker()
      }
      if (this.checked == false){
        this.wc.unregWorker()
      }

      this.setTime()
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
      this.wc.setNotificationType(dd.value)
      if (dd.value == "Summary") {
      this.ns.SetSummaryTime().subscribe()
      }
    }

    testNotification(){
      this.ns.testNotification().subscribe()
    }


    setTime(){
      this.ns.SetSummaryTime().subscribe()
    }

    retrieveLocalStorgeValue(){
      this.SelectType = localStorage.getItem("dropDownValue")
      console.log(this.SelectType)
      this.checked = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
      console.log(this.checked)

    }
    
  }  
  