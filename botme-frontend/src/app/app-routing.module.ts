import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/pages/contact/contact.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AuthGuard } from "./auth.guard";
import { LoginComponent } from "./components/pages/login/login.component";
import { WrapperComponent } from "./components/layout/wrapper/wrapper.component";
import { OrderOverviewDetailComponent } from "./modules/restaurant/components/order/order-overview-detail/order-overview-detail.component";
import {ForgotComponent} from "./components/pages/forgot/forgot.component";
import {SignupComponent} from "./components/pages/signup/signup.component";

const routes: Routes = [
  {
    path: 'login',
    data: { pageTitle: 'Login' },
    component: LoginComponent
  },
  {
    path: 'forgot',
    data: {pageTitle: 'Forgot'},
    component: ForgotComponent
  },
  {
    path: 'signup',
    data: {pageTitle: 'Signup'},
    component: SignupComponent
  },
  {
    path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        data: { pageTitle: 'Home' },
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'order-detail',
        data: { pageTitle: 'Order Detail'},
        component: OrderOverviewDetailComponent
      },
      {
        path: 'contact',
        data: { pageTitle: 'Contact Us' },
        component: ContactComponent
      },
      {
        path: 'client',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Clients', breadcrumb: {skip:true} },
        loadChildren: () => import('./modules/robot/clients/clients.module').then(m => m.ClientsModule),
      },
      {
        path: 'session',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Sessions'
       },
        loadChildren: () => import('./modules/robot/sessions/sessions.module').then(m => m.SessionsModule)
      },
      {
        path: 'conversations',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Conversations' },
        loadChildren: () => import('./modules/robot/conversations/conversations.module').then(m => m.ConversationsModule)
      },
      {
        path: 'client-conversation',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Client Conversations' },
        loadChildren: () => import('./modules/robot/client-conversation/client-conversation.module').then(m => m.ClientConversationModule)
      },
      {
        path: 'corpus',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Corpus' },
        loadChildren: () => import('./modules/robot/corpus/corpus.module').then(m => m.CorpusModule)
      },
      {
        path: 'device',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Device' },
        loadChildren: () => import('./modules/robot/devices/devices.module').then(m => m.DevicesModule)
      },
      {
        path: 'restaurant',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Restaurant' },
        loadChildren: () => import('./modules/restaurant/restaurant.module').then(m => m.RestaurantModule)
      },
      {
        path: 'dictionary',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Dictionary' },
        loadChildren: () => import('./modules/dictionary/dictionary.module').then(m => m.DictionaryModule)
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { pageTitle: 'Administration' },
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
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
