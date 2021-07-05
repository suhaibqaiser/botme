import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionListComponent } from './session-list/session-list.component';


@NgModule({
  declarations: [SessionListComponent],
  imports: [
    CommonModule,
    SessionsRoutingModule
  ]
})
export class SessionsModule { }
