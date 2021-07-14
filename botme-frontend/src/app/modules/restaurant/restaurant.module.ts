import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantRoutingModule } from './restaurant-routing.module';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerSingleComponent } from './components/customer/customer-single/customer-single.component';
import { ReactiveFormsModule } from "@angular/forms";
import { ReservationListComponent } from "./components/reservation/reservation-list/reservation-list.component";
import { ReservationDetailComponent } from './components/reservation/reservation-detail/reservation-detail.component';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import {ToggleButtonModule} from 'primeng/togglebutton';

@NgModule({
  declarations: [ReservationListComponent, CustomerListComponent, CustomerSingleComponent, ReservationDetailComponent],
  imports: [
    CommonModule,
    RestaurantRoutingModule,
    ReactiveFormsModule,
    PanelModule,
    DividerModule,
    ButtonModule,
    ToggleButtonModule
  ]
})
export class RestaurantModule {
}
