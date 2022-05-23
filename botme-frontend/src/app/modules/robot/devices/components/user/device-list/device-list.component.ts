import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getClients();
  }
  devices: Array<any> = [];
  loading = true

  getClients(): void {
    this.userService.getUsers()
      .subscribe(result => {
        this.devices = result.payload
        this.loading = false;
      });
  }

  clear(table: Table) {
    table.clear();
  }
}
