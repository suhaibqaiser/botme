import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { UserListComponent } from './components/user/user-list/user-list.component';

const routes: Routes = [
    {
        path: 'user',
        data: { pageTitle: 'User List' },
        component: UserListComponent
    },
    {
        path: 'user/detail',
        data: { pageTitle: 'User Detail' },
        component: UserDetailComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
