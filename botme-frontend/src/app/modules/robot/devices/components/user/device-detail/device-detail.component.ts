import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Md5 } from 'ts-md5';
import { User } from '../../../model/user';
import { DeviceService } from '../../../service/device.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {


  editMode = false
  newForm = false
  formMode = 'update';
  deviceType: any;
  

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService, private deviceService: DeviceService,
    private route: ActivatedRoute, private fb: FormBuilder,private router: Router) {
  }

  userForm = this.fb.group({
    deviceId: new FormControl(''),
    deviceName: new FormControl('', Validators.required),
    deviceLabel: new FormControl(''),
    deviceType: new FormControl(''),
    deviceActive: new FormControl(true),
    deviceDescription: new FormControl(''),
  });

  deviceId='';
  user: User = {
    deviceId: '',
    deviceName: '',
    deviceLabel: '',
    deviceType: '',
    deviceActive: true,
    deviceDescription: '',
  }
  deviceList :any []= [
    {label:'web', value:'web'},
    {label:'robot', value:'robot'}
    ]

  async ngOnInit() {
    this.deviceId = this.route.snapshot.queryParams['deviceId']

    console.log("deviceId==>",this.deviceId)

    if (!this.deviceId) {
      this.formMode = 'new'
      this.newForm = true
      this.enableEdit()
    } else {
      this.getDeviceDetails(this.deviceId);
      this.disableEdit()
    }
  
    this.deviceService.getDevices().subscribe(res => {
      console.log(res.payload);

      this.deviceType = res.payload
    })
    }


  device: Array<any> = []
  newDevice: any
  deviceDialog = false


  getDeviceDetails(deviceId: string): void {
    this.deviceService.getDeviceDetails(deviceId).subscribe(
      result => {
        this.user = result.payload
        this.userForm.patchValue(this.user)
      }
    );
  }

  async addDevice() {
    console.log(this.userForm.value);
    
    this.deviceService.addDevice(this.userForm.value).subscribe(res => {
 
      if (res.status === 'success') {
        this.messageService.add({ severity: 'info', summary: 'Add Success', detail: 'Device added!' }) 
        this.disableEdit()
      } else { 
        this.messageService.add({ severity: 'error', summary: 'Add Failed', detail: `Reason: ${res.payload}` })
      }
    })
  }

  editDevice() {
    this.deviceService.editDevice(this.userForm.value).subscribe(res => {
      if (res.status === 'success') {
        this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'Device updated!' }) 
        this.disableEdit()
      } else {
        this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: `Reason: ${res.payload}` })
      }
    })
  }

  removeDevice() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deviceService.removeDevice(this.userForm.value).subscribe(res => {
        let iD = this.userForm.value
          if (res.status === 'success') {
            this.messageService.add({ severity: 'info', summary: 'Delete Success', detail: 'Device deleted!' })
            this.device.splice(iD.deviceId, 1)
            this.router.navigate(['device/device'])
          } else {
            this.messageService.add({ severity: 'error', summary: 'Delete Failed', detail: `Reason: ${res.payload}` })
          }
        })
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  


  get f() { return this.userForm.controls; }


  addNew() {
    this.newDevice = {
     deviceName: '',
     deviceActive: true,
     deviceLabel: '',
     deviceDescription:''
   }

   this.deviceDialog = true
 }

  
  disableEdit() {
    this.editMode = false
    this.userForm.disable()
  }

  enableEdit() {
    this.editMode = true
    this.userForm.enable()
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.validateAllFormFields(this.userForm); //{7}
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill all the required fields' })
      return
    }
    if (this.formMode === 'update') {
      console.log("EditUserForm=>",this.userForm.value)
      this.editDevice();
    } else {
      console.log("AddUserForm=>",this.userForm.value)
      this.addDevice()
    }
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

}
