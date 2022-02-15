import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../service/notification.service';


@Component({
    selector: 'app-notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.css']
  })
  export class NotificationListComponent implements OnInit {
  
    constructor(private userService: NotificationService) { }
  
    ngOnInit(): void {

    } 
}
  