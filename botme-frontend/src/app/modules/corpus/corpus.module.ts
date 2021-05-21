import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorpusListComponent } from './corpus-list/corpus-list.component';
import { CorpusDetailComponent } from './corpus-detail/corpus-detail.component';
import {CorpusRoutingModule} from "./corpus-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GuiGridModule} from "@generic-ui/ngx-grid";
import {ToastModule} from "primeng/toast";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {FieldsetModule} from "primeng/fieldset";

@NgModule({
  declarations: [
    CorpusListComponent,
    CorpusDetailComponent
  ],
  imports: [
    CommonModule,
    CorpusRoutingModule,
    ReactiveFormsModule,
    GuiGridModule,
    ToastModule,
    TableModule,
    DropdownModule,
    FormsModule,
    InputNumberModule,
    FieldsetModule
  ]
})
export class CorpusModule { }
