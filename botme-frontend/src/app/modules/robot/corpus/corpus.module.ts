import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorpusListComponent } from './corpus-list/corpus-list.component';
import { CorpusDetailComponent } from './corpus-detail/corpus-detail.component';
import { CorpusRoutingModule } from "./corpus-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { FieldsetModule } from "primeng/fieldset";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { InputTextModule } from "primeng/inputtext";
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [
    CorpusListComponent,
    CorpusDetailComponent
  ],
  imports: [
    CommonModule,
    CorpusRoutingModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    DropdownModule,
    FormsModule,
    InputNumberModule,
    FieldsetModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    SelectButtonModule,
    TabViewModule
  ]
})
export class CorpusModule { }
