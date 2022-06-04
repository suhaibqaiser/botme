import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DeviceService } from '../../../service/device.service';
import { User } from '../../../model/user';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  constructor(private deviceService: DeviceService,private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

   

 async ngOnInit() {
    await this.getDevices();
  }
  device: Array<any> = []
  newDevice: any
  deviceDialog = false
  loading = true

  async getDevices() {
    this.deviceService.getDevices().subscribe(res => {
      console.log(res);
      this.loading=false
      if (res.status === 'error') return this.device 
      return this.device = res.payload
    })
  }
 


  clear(table: Table) {
    table.clear();
  }
}
