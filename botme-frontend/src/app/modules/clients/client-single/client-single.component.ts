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
    formclientcomment: ['']
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
    console.log('Form Submitted');
  }

  getClientDetail(clientId: string): void {
    console.log(clientId);
    this.clientService.getClientDetail(clientId).subscribe(
      result => {
        this.client = result.payload
        this.clientForm.patchValue({
          formclientdeviceid: this.client?.clientDeviceId,
          formclientcomment: this.client?.clientComment,
          formclientsecret: this.client?.clientSecret
        })
      }
    );
  }

  updateClient(client: object): void {
    this.clientService.updateClient(client)
      .subscribe(result => console.log(result.payload));
  }

}
