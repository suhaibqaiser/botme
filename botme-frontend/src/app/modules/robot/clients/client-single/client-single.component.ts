import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IClient} from '../model/client';
import {ClientService} from '../service/client.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-client-single',
  templateUrl: './client-single.component.html',
  styleUrls: ['./client-single.component.css']
})
export class ClientSingleComponent implements OnInit {

  constructor(private clientService: ClientService, private route: ActivatedRoute, private fb: FormBuilder) {
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
    formrestaurantid: ['']
  });

  formMode = 'update';
  clientId = '';
  client: IClient = {
    clientDeviceId: '',
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
    restaurantId: ''
  }
  restaurantList: any = []
  resturantId: any = ''

  async ngOnInit() {
    // await this.clientService.getActiveRestaurant().subscribe((res: any) => {
    //   if (res.status === 'success') {
    //     this.restaurantList = res.payload
    //     console.log(this.restaurantList)
    //   }
    // })
    // console.log(this.restaurantList)
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
    if (this.clientForm.invalid) {
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
        this.client = result.payload
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
          formrestaurantid: this.client.restaurantId
        })
      }
    );
  }

  updateClient(client: object): void {
    this.patchFormValues();

    let clientSecret = Md5.hashStr(this.client.clientSecret)
    this.client.clientSecret = clientSecret

    this.clientService.updateClient(client)
      .subscribe(result => this.client = result.payload);
  }

  registerClient(): void {
    this.patchFormValues();

    let clientSecret = Md5.hashStr(this.client.clientSecret)
    this.client.clientSecret = clientSecret

    this.clientService.registerClient(this.client)
      .subscribe(result => {
        this.client = result.payload
      })

  }

  patchFormValues() {
    this.resturantId = localStorage.getItem('restaurantId') ? localStorage.getItem('restaurantId') : ''
    this.client.clientID = this.clientForm.getRawValue().formclientid
    this.client.clientDeviceId = this.clientForm.getRawValue().formclientdeviceid
    this.client.clientSecret = this.clientForm.getRawValue().formclientsecret
    this.client.clientComment = this.clientForm.getRawValue().formclientcomment
    this.client.clientName = this.clientForm.getRawValue().formclientname
    this.client.clientActive = this.clientForm.getRawValue().formclientactive
    this.client.clientDebug = this.clientForm.getRawValue().formclientdebug
    this.client.clientVoiceEnabled = this.clientForm.getRawValue().formclientvoice
    this.client.restaurantId = this.resturantId
    this.client.clientVoiceTimeout = this.clientForm.getRawValue().formclientvoicetimeout
  }
}

