import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IClient} from '../model/client';
import {ClientService} from '../service/client.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';
import {MessageService,} from "primeng/api";
import {AuthenticationService} from "../../../../services/authentication.service";
import { DeviceService } from '../../devices/service/device.service';

@Component({
  selector: 'app-client-single',
  templateUrl: './client-single.component.html',
  styleUrls: ['./client-single.component.css']
})
export class ClientSingleComponent implements OnInit {

  constructor(private messageService: MessageService, private authService: AuthenticationService, private _messageService: MessageService, private clientService: ClientService, private route: ActivatedRoute, private fb: FormBuilder, private deviceService: DeviceService) {
  }

  clientForm = this.fb.group({
    formclientdeviceid: ['', Validators.required],
    formclientid: ['', Validators.required],
    formclientsecret: [''],
    formclientcomment: [''],
    formclientname: ['', Validators.required],
    formclientactive: true,
    formclientdebug: false,
    formclientvoice: true,
    formclientvoicetimeout: [3000, Validators.required],
    formrestaurantid: [''],
    clientSecretHint: [''],
    clientEmail: ['']
  });

  formMode = 'update';
  clientId = '';
  client: IClient = {
    clientDeviceId: '',
    clientType: 'bot',
    clientID: '',
    clientName: '',
    clientSecret: '',
    clientDebug: false,
    clientVoiceEnabled: true,
    clientVoiceTimeout: 3000,
    clientCreated: '',
    clientUpdated: '',
    clientActive: true,
    clientComment: '',
    restaurantId: '',
    clientSecretHint: '',
    clientEmail: '',
  }
  restaurantObj: any = []
  resturantId: any = ''
  tempClientSceret = ''
  deviceList = new Array

  async ngOnInit() {

    this.deviceService.getDevices().subscribe(res => {
      
      console.log(res.payload);

      this.deviceList = res.payload
    })

    await this.clientService.getActiveRestaurant().subscribe((res: any) => {
      if (res.status === 'success') {
        const restaurantList = res.payload
        if (restaurantList && restaurantList.length) {
          this.restaurantObj = restaurantList.find((item: any) => item.restaurantId === this.authService.getRestaurantId())
        }
      }
      return true
    })
    this.route.queryParams
      .subscribe(params => {
        this.clientId = params.clientId;
      });

    if (!this.clientId) {
      this.formMode = 'new'
      console.log(this.formMode);

    } else {
      this.getClientDetail(this.clientId);
    }
    this.resturantId = localStorage.getItem('restaurantId') ? localStorage.getItem('restaurantId') : ''
  }

  onSubmit(): void {
    this.resturantId = localStorage.getItem('restaurantId') ? localStorage.getItem('restaurantId') : ''
    if (this.clientForm.invalid) {
      this._messageService.add({
        severity: 'error',
        summary: 'Validation Failed',
        detail: `Kindly fill in the required fields`
      });
      return;
    }
    if (this.formMode === 'update') {

      this.updateClient(this.client);
    } else {
      this.registerClient()
    }
  }

  getClientDetail(clientId: string): void {
    this.clientService.getClientDetail(clientId).subscribe(
      result => {
        this.client = JSON.parse(JSON.stringify(result.payload))
        this.tempClientSceret = JSON.parse(JSON.stringify(this.client.clientSecret))
        this.resturantId = localStorage.getItem('restaurantId') ? localStorage.getItem('restaurantId') : ''
        this.clientForm.patchValue({
          formclientid: this.client.clientID,
          formclientdeviceid: this.client?.clientDeviceId,
          formclientcomment: this.client?.clientComment,
          formclientsecret: this.client?.clientSecret,
          formclientname: this.client.clientName,
          formclientactive: this.client.clientActive,
          formclientdebug: this.client.clientDebug,
          formclientvoice: this.client.clientVoiceEnabled,
          formclientvoicetimeout: this.client.clientVoiceTimeout,
          formrestaurantid: this.client.restaurantId,
          clientSecretHint: this.client.clientSecretHint,
          clientEmail: this.client.clientEmail
        })
      }
    );
  }

  updateClient(client: any): void {
    this.patchFormValues();

    if (this.tempClientSceret !== this.client.clientSecret) {
      let clientSecret = Md5.hashStr(this.client.clientSecret)
      this.client.clientSecret = clientSecret
    }

    console.log("update bot")

    this.clientService.updateClient(client)
      .subscribe(result => {
        this.client = result.payload
        this.messageService.add({
          severity: result.status === 'success' ? 'info' : 'error',
          summary: result.status === 'success' ? 'Success' : 'Error',
          detail: `Reason: ${result.statusMessage}`
        })
      });
  }

  registerClient(): void {
    this.patchFormValues();


    let clientSecret = Md5.hashStr(this.client.clientSecret)
    this.client.clientSecret = clientSecret

    console.log("saving bot")

    this.clientService.registerClient(this.client)
      .subscribe(result => {
        this.client = result.payload
        this.messageService.add({
          severity: result.status === 'success' ? 'info' : 'error',
          summary: result.status === 'success' ? 'Success' : 'Error',
          detail: result.message
        })
      })

  }

  patchFormValues() {
    this.resturantId = localStorage.getItem('restaurantId') ? localStorage.getItem('restaurantId') : ''
    this.tempClientSceret = this.clientForm.getRawValue().formclientsecret
    this.client.clientID = this.clientForm.getRawValue().formclientid
    this.client.clientDeviceId = this.clientForm.getRawValue().formclientdeviceid
    this.client.clientType = 'bot'
    this.client.clientSecret = this.clientForm.getRawValue().formclientsecret
    this.client.clientComment = this.clientForm.getRawValue().formclientcomment
    this.client.clientName = this.clientForm.getRawValue().formclientname
    this.client.clientActive = this.clientForm.getRawValue().formclientactive
    this.client.clientDebug = this.clientForm.getRawValue().formclientdebug
    this.client.clientVoiceEnabled = this.clientForm.getRawValue().formclientvoice
    this.client.restaurantId = this.resturantId
    this.client.clientVoiceTimeout = this.clientForm.getRawValue().formclientvoicetimeout
    this.client.clientSecretHint = this.clientForm.getRawValue().clientSecretHint
    this.client.clientEmail = this.clientForm.getRawValue().clientEmail
  }
}

