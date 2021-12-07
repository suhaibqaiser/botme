import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';
import { ReservationDetailComponent } from './components/reservation/reservation-detail/reservation-detail.component';
import { ReservationListComponent } from './components/reservation/reservation-list/reservation-list.component'
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductDetailComponent } from './components/product/product-detail/product-detail.component';
import { MenuListComponent } from './components/menu/menu-list/menu-list.component';
import { MenuDetailComponent } from './components/menu/menu-detail/menu-detail.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { OrderDetailComponent } from './components/order/order-detail/order-detail.component';
import { TableListComponent } from './components/table/table-list/table-list.component';
import { TableDetailComponent } from './components/table/table-detail/table-detail.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';

const routes: Routes = [
  {
    path: 'customer',
    data: { pageTitle: 'Customer List' },
    component: CustomerListComponent
  },
  {
    path: 'customer/detail',
    component: CustomerDetailComponent
  },
  {
    path: 'reservation',
    component: ReservationListComponent
  },
  {
    path: 'reservation/detail',
    component: ReservationDetailComponent
  },
  {
    path: 'product',
    component: ProductListComponent
  },
  {
    path: 'product/detail',
    component: ProductDetailComponent
  },
  {
    path: 'category',
    component: CategoryListComponent
  },
  {
    path: 'category/detail',
    component: ProductDetailComponent
  },
  {
    path: 'menu',
    component: MenuListComponent
  },
  {
    path: 'menu/detail',
    component: MenuDetailComponent
  },
  {
    path: 'order',
    component: OrderListComponent
  },
  {
    path: 'order/detail',
    component: OrderDetailComponent
  },
  {
    path: 'table',
    component: TableListComponent
  },
  {
    path: 'table/detail',
    component: TableDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule {
}
