import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientSingleComponent } from './client-single/client-single.component';
import { ReactiveFormsModule } from "@angular/forms";
import { InplaceModule } from 'primeng/inplace';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';



@NgModule({
  declarations: [ClientListComponent, ClientSingleComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    ReactiveFormsModule,
    InplaceModule,
    InputSwitchModule,
    ToggleButtonModule,
    InputTextModule,
    PasswordModule
  ]
})
export class ClientsModule { }
