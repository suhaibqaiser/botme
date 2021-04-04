import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientSingleComponent } from './client-single/client-single.component';

const routes: Routes = [
  {
    path: '',
    data: { pageTitle: 'Client List' },
    component: ClientListComponent
  },
  {
    path: 'single/:clientID',
    component: ClientSingleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
