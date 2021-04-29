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

  constructor(private clientService: ClientService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
  }

  updateClientForm = this.formBuilder.group({
    'form-client-id': '',
    'form-client-device-id': '',
    'form-client-secret': ''
  });
  clientId = '';
  client: IClient | undefined;

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.clientId = params.clientId;
      });

    this.getClientDetail(this.clientId);
  }

  onSubmit(): void {
    console.log('Form Submitted');
  }

  getClientDetail(clientId: string): void {
    console.log(clientId);
    this.clientService.getClientDetail(clientId).subscribe(result => this.client = result.payload);
  }

  updateClient(client: object): void {
    this.clientService.updateClient(client)
      .subscribe(result => console.log(result.payload));
  }

}
