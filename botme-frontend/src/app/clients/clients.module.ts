import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientSingleComponent } from './client-single/client-single.component';


@NgModule({
  declarations: [ClientListComponent, ClientSingleComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule
  ]
})
export class ClientsModule { }
