import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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

  constructor(private messageService: MessageService, private authService: AuthenticationService, private _messageService: MessageService, private clientService: ClientService, private route: ActivatedRoute, private fb: FormBuilder, private deviceService: DeviceService, private router: Router) {
  }

  clientForm = this.fb.group({
    formclientdeviceid: [''],
    formclientid: ['', Validators.required],
    formclientType: ['', Validators.required],
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
    clientType: '',
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
  clientType :any []= ['customer','bot']

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
        if (result.status == "success") {
          this.router.navigate(['client'])
        }
      })

  }

  patchFormValues() {
    let test = JSON.parse(JSON.stringify(this.clientForm.getRawValue()))
    this.resturantId = localStorage.getItem('restaurantId') ? localStorage.getItem('restaurantId') : ''
    this.tempClientSceret = test.formclientsecret
    this.client.clientID = test.formclientid
    this.client.clientDeviceId = test.formclientdeviceid
    this.client.clientType = test.formclientType
    this.client.clientSecret = test.formclientsecret
    this.client.clientComment = test.formclientcomment
    this.client.clientName = test.formclientname
    this.client.clientActive = test.formclientactive
    this.client.clientDebug = test.formclientdebug
    this.client.clientVoiceEnabled = test.formclientvoice
    this.client.restaurantId = this.resturantId
    this.client.clientVoiceTimeout = test.formclientvoicetimeout
    this.client.clientSecretHint = test.clientSecretHint
    this.client.clientEmail = test.clientEmail
  }
}

