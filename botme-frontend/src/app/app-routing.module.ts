import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      data: { pageTitle: "Home" },
      component: HomeComponent,
      pathMatch: 'full'
    },
    {
      path: 'contact',
      data: { pageTitle: "Contact Us" },
      component: ContactComponent
    },
    {
      path: 'client',
      data: { pageTitle: "Clients" },
      loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
