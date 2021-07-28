import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AdminRoutingModule } from './admin-routing.module';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { ProductDetailComponent } from './components/product/product-detail/product-detail.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    CategoryListComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
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
export class AdminModule { }
