import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IClient} from '../model/client';
import {ClientService} from '../service/client.service';
import {FormBuilder, Validators} from '@angular/forms';

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
    formclientsecret: [''],
    formclientcomment: [''],
    formclientname: ['', Validators.required],
    formclientactive: true
  });

  formMode = 'update';
  clientId = '';
  client: IClient | any

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.clientId = params.clientId;
      });
    if (!this.clientId) {
      this.formMode = 'new'
    } else {
      this.getClientDetail(this.clientId);
    }
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      return;
    }
    if (this.formMode === 'update') {
      this.updateClient(this.client);
    } else {
      this.registerClient(this.client)
    }
  }

  getClientDetail(clientId: string): void {
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
    this.client.clientName = this.clientForm.getRawValue().formclientname
    this.client.clientActive = this.clientForm.getRawValue().formclientactive

    this.clientService.updateClient(client)
      .subscribe(result => this.client = result.payload);
  }

  registerClient(client: object): void {
    this.client.clientDeviceId = this.clientForm.getRawValue().formclientdeviceid
    this.client.clientComment = this.clientForm.getRawValue().formclientcomment
    this.client.clientName = this.clientForm.getRawValue().formclientname
    this.client.clientActive = this.clientForm.getRawValue().formclientactive

    this.clientService.registerClient(client)
      .subscribe(result => {
        this.client = result.payload
      })

  }
}
