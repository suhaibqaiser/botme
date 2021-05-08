import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IClient} from '../model/client';
import {ClientService} from '../service/client.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-client-single',
  templateUrl: './client-single.component.html',
  styleUrls: ['./client-single.component.css']
})
export class ClientSingleComponent implements OnInit {

  constructor(private clientService: ClientService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  clientForm = this.fb.group({
    formclientdeviceid: [''],
    formclientsecret: [''],
    formclientcomment: [''],
    formclientname: [''],
    formclientactive: true
  });

  clientId = '';
  client: IClient = {
    clientDeviceId: '',
    clientID: '',
    clientName: '',
    clientSecret: '',
    clientCreated: '',
    clientUpdated: '',
    clientActive: true,
    clientComment: ''
  };

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.clientId = params.clientId;
      });
    this.getClientDetail(this.clientId);
  }

  onSubmit(): void {
    this.updateClient(this.client);
  }

  getClientDetail(clientId: string): void {
    console.log(clientId);
    this.clientService.getClientDetail(clientId).subscribe(
      result => {
        this.client = result.payload
        this.clientForm.patchValue({
          formclientdeviceid: this.client?.clientDeviceId,
          formclientcomment: this.client?.clientComment,
          formclientsecret: this.client?.clientSecret,
          formclientname: this.client.clientName,
          formclientactive: this.client.clientActive
        })
      }
    );
  }

  updateClient(client: object): void {
    this.client.clientSecret = this.clientForm.getRawValue().formclientsecret
    this.client.clientDeviceId = this.clientForm.getRawValue().formclientdeviceid
    this.client.clientComment = this.clientForm.getRawValue().formclientcomment
    this.client.clientName= this.clientForm.getRawValue().formclientname
    this.client.clientActive = this.clientForm.getRawValue().formclientactive

    this.clientService.updateClient(client)
      .subscribe(result => this.client = result.payload);
  }

}
