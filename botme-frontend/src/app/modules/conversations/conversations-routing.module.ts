import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversationLogComponent } from './conversation-log/conversation-log.component';

const routes: Routes = [
  {
    path: 'conversationlog/:sessionId',
    data: { pageTitle: 'Conversations' },
    component: ConversationLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversationsRoutingModule { }
