import { Component, OnInit } from '@angular/core';
// import { NotificationService } from '../../../service/notification.service';
import { WrapperComponent } from 'src/app/components/layout/wrapper/wrapper.component';
import { NotificationService } from '../../../service/notification.service';
import { UserService } from '../../../service/user.service';


@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.css']
  })
  
  
  export class NotificationListComponent implements OnInit {

    constructor(private wc :WrapperComponent,private ns:NotificationService,private userservice: UserService) {}

    SelectType: any 
    checked: boolean = false
    NotificationType: any =["Order","Summary"]

    ngOnInit(): void {
      this.retrieveLocalStorgeValue()
    }

    handleChange(e:any){
      localStorage.setItem("inputSwitch",e.checked)
      let user = {userId: localStorage.getItem('userId'),notificationState:e.checked}
      this.userservice.updateUser(user).subscribe()

      if (e.checked == true){
        this.wc.regWorker()
      }

      if (e.checked == false){
        this.wc.unregWorker()
      }

    }

    dropDown(dd:any){
      localStorage.setItem("dropDownValue",dd.value)

      let user = {userId: localStorage.getItem('userId'),notificationType:dd.value}
      this.userservice.updateUser(user).subscribe()
      
      this.wc.setNotificationType(dd.value)
      
      if (dd.value == "Summary") {
      this.ns.SetSummaryTime().subscribe()
      }
    }

    testNotification(){
      this.ns.testNotification().subscribe()
    }

    retrieveLocalStorgeValue(){
      this.SelectType = localStorage.getItem("dropDownValue")
      this.checked = JSON.parse(localStorage.getItem("inputSwitch") || '{}')
    }
  }  
  