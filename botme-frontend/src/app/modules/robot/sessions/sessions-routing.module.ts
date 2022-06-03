import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionListComponent } from './session-list/session-list.component';

const routes: Routes = [
  {
    path: '',
    data: { pageTitle: 'Session List'
  },
    component: SessionListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule { }
