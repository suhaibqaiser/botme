import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from "@angular/forms";
import {FormsModule} from "@angular/forms";

import { TableModule } from "primeng/table";
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {InputSwitchModule} from 'primeng/inputswitch';

import {SelectButtonModule} from 'primeng/selectbutton';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { NotificationListComponent } from './components/notification/notification-list/notification-list.component';


@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    NotificationListComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    DividerModule,
    ToggleButtonModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    InputSwitchModule,
    SelectButtonModule,
    FormsModule
  ]
})
export class AdminModule { }
