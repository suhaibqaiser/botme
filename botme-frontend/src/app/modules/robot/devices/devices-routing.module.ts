import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceDetailComponent } from './components/user/device-detail/device-detail.component';
import { DeviceListComponent } from './components/user/device-list/device-list.component';

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
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule {
}
