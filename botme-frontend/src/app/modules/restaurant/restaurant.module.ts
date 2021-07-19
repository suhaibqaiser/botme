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
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductDetailComponent } from './components/product/product-detail/product-detail.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
  declarations: [ReservationListComponent,
    CustomerListComponent,
    CustomerSingleComponent,
    ReservationDetailComponent,
    ProductListComponent,
    ProductDetailComponent],
  imports: [
    CommonModule,
    RestaurantRoutingModule,
    ReactiveFormsModule,
    PanelModule,
    DividerModule,
    ButtonModule,
    ToggleButtonModule,
    DropdownModule,
    MultiSelectModule,
    InputNumberModule,
    InputTextModule,
    ChipsModule,
    CardModule,
    AutoCompleteModule
  ]
})
export class RestaurantModule {
}
