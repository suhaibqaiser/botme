import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantRoutingModule } from './restaurant-routing.module';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';
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
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { TableModule } from "primeng/table";
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [ReservationListComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    ReservationDetailComponent,
    ProductListComponent,
    ProductDetailComponent,
    CategoryListComponent],
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
    AutoCompleteModule,
    DialogModule,
    TableModule,
    InputSwitchModule,
    FormsModule
  ]
})
export class RestaurantModule {
}
