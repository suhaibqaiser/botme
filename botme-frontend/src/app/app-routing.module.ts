import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactComponent} from './components/pages/contact/contact.component';
import {HomeComponent} from './components/pages/home/home.component';
import {AuthGuard} from "./auth.guard";
import {LoginComponent} from "./components/pages/login/login.component";
import {WrapperComponent} from "./components/layout/wrapper/wrapper.component";

const routes: Routes = [
  {
    path: 'login',
    data: {pageTitle: 'Login'},
    component: LoginComponent
  },
  {
    path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
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
        canActivate: [AuthGuard],
        data: {pageTitle: 'Clients'},
        loadChildren: () => import('./modules/clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'session',
        canActivate: [AuthGuard],
        data: {pageTitle: 'Sessions'},
        loadChildren: () => import('./modules/sessions/sessions.module').then(m => m.SessionsModule)
      },
      {
        path: 'conversations',
        canActivate: [AuthGuard],
        data: {pageTitle: 'Conversations'},
        loadChildren: () => import('./modules/conversations/conversations.module').then(m => m.ConversationsModule)
      },
      {
        path: 'client-conversation',
        canActivate: [AuthGuard],
        data: {pageTitle: 'Client Conversations'},
        loadChildren: () => import('./modules/client-conversation/client-conversation.module').then(m => m.ClientConversationModule)
      },
      {
        path: 'corpus',
        canActivate: [AuthGuard],
        data: {pageTitle: 'Corpus'},
        loadChildren: () => import('./modules/corpus/corpus.module').then(m => m.CorpusModule)
      },
      {
        path: 'restaurant',
        canActivate: [AuthGuard],
        data: {pageTitle: 'Restaurant'},
        loadChildren: () => import('./modules/restaurant/restaurant.module').then(m => m.RestaurantModule)
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
