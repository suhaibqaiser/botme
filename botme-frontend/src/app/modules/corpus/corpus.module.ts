import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorpusListComponent } from './corpus-list/corpus-list.component';
import { CorpusDetailComponent } from './corpus-detail/corpus-detail.component';
import {CorpusRoutingModule} from "./corpus-routing.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    CorpusListComponent,
    CorpusDetailComponent
  ],
  imports: [
    CommonModule,
    CorpusRoutingModule,
    ReactiveFormsModule
  ]
})
export class CorpusModule { }