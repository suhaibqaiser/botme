import { Component, OnInit } from '@angular/core';
import { ClientService } from '../service/client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.getClients();
  }

  clients: Array<any> = [];

  selectedClient?: string;

  onSelect(client: any): void {
    this.selectedClient = client.clientID;
  }

  getClients(): void {
    this.clientService.getClients()
      .subscribe(result => this.clients = result.payload);
  }
}
