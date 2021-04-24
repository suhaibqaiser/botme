import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConversationsRoutingModule} from "./conversations-routing.module";
import {ConversationLogComponent} from './conversation-log/conversation-log.component';


@NgModule({
  declarations: [
    ConversationLogComponent
  ],
  imports: [
    CommonModule,
    ConversationsRoutingModule
  ]
})
export class ConversationsModule {
}
