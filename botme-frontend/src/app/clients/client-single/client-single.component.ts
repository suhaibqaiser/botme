import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IClient } from '../model/client';
import { ClientService } from '../service/client.service';

@Component({
  selector: 'app-client-single',
  templateUrl: './client-single.component.html',
  styleUrls: ['./client-single.component.css']
})
export class ClientSingleComponent implements OnInit {
  @Input() clientID?: string;
  sub: any;

  client?: IClient;
  mapService: any;
  busDepotLocality: any;
  constructor(private clientService: ClientService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(p => { this.clientID = p['clientID'] });
    this.getClientDetail(this.clientID);
    console.log(this.clientID);
  }

  async getClientDetail(clientID?: string) {
    if (clientID !== undefined) {
      await this.clientService  // Step 2
        .getClientDetail(clientID)
        .toPromise().then((data) => {
          this.client = data.payload.clients; // Step 3
        });
    } else {
      console.log('ClientID missing');
    }
  }
}
