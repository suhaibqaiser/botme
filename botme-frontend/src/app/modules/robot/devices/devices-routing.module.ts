import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceDetailComponent } from './components/user/device-detail/device-detail.component';
import { DeviceListComponent } from './components/user/device-list/device-list.component';
import { NotificationListComponent } from './components/notification/notification-list/notification-list.component';

const routes: Routes = [
  {
    path: 'device',
    data: { pageTitle: 'device List' },
    component: DeviceListComponent
  },
  {
    path: 'device/detail',
    data: { pageTitle: 'Device Detail' },
    component: DeviceDetailComponent
  },
  {
    path: 'notification',
    data: { pageTitle: 'Notification List' },
    component: NotificationListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule {
}
