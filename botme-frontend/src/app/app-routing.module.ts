import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactComponent} from './components/pages/contact/contact.component';
import {HomeComponent} from './components/pages/home/home.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      data: {pageTitle: 'Home'},
      component: HomeComponent,
      pathMatch: 'full'
    },
    {
      path: 'contact',
      data: {pageTitle: 'Contact Us'},
      component: ContactComponent
    },
    {
      path: 'client',
      data: {pageTitle: 'Clients'},
      loadChildren: () => import('./modules/clients/clients.module').then(m => m.ClientsModule)
    },
    {
      path: 'session',
      data: {pageTitle: 'Sessions'},
      loadChildren: () => import('./modules/sessions/sessions.module').then(m => m.SessionsModule)
    },
    {
      path: 'conversations',
      data: {pageTitle: 'Conversations'},
      loadChildren: () => import('./modules/conversations/conversations.module').then(m => m.ConversationsModule)
    },
    {
      path: 'client-conversation',
      data: {pageTitle: 'Client Conversations'},
      loadChildren: () => import('./modules/client-conversation/client-conversation.module').then(m => m.ClientConversationModule)
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
