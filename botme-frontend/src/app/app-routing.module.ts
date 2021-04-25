import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      data: { pageTitle: 'Home' },
      component: HomeComponent,
      pathMatch: 'full'
    },
    {
      path: 'contact',
      data: { pageTitle: 'Contact Us' },
      component: ContactComponent
    },
    {
      path: 'client',
      data: { pageTitle: 'Clients' },
      loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
    },
    {
      path: 'session',
      data: { pageTitle: 'Sessions' },
      loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule)
    },
    {
      path: 'conversations',
      data: { pageTitle: 'Conversations' },
      loadChildren: () => import('./conversations/conversations.module').then(m => m.ConversationsModule)
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
