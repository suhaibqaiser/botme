import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerSingleComponent } from './components/customer/customer-single/customer-single.component';
import { ReservationDetailComponent } from './components/reservation/reservation-detail/reservation-detail.component';
import { ReservationListComponent } from './components/reservation/reservation-list/reservation-list.component'

const routes: Routes = [
  {
    path: 'customer',
    data: { pageTitle: 'Customer List' },
    component: CustomerListComponent
  },
  {
    path: 'customer/detail',
    component: CustomerSingleComponent
  },
  {
    path: 'reservation',
    component: ReservationListComponent
  },
  {
    path: 'reservation/detail',
    component: ReservationDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule {
}
