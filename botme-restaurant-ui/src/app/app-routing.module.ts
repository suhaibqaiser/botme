import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/pages/home/home.component";
import {MenuComponent} from "./components/pages/menu/menu.component";
import {ReservationsComponent} from "./components/pages/reservations/reservations.component";
import {PrivacyPolicyComponent} from "./components/pages/privacy-policy/privacy-policy.component";
import {SearchMenuComponent} from "./components/pages/search-menu/search-menu.component";
import {ContactSectionComponent} from "./components/sections/contact-section/contact-section.component";
import {ContactUsComponent} from "./components/pages/contact-us/contact-us.component";
import {ProductDetailComponent} from "./components/pages/product-detail/product-detail.component";
import {CartComponent} from "./components/pages/cart/cart.component";
import {CheckoutComponent} from "./components/pages/checkout/checkout.component";
import {AuthenticationGuard} from "./services/authentication.guard";
import {DemoPageComponent} from "./components/pages/demo-page/demo-page.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "menu",
    component: MenuComponent
  },
  {
    path: "online-shop",
    component: SearchMenuComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: "contact-us",
    component: ContactUsComponent
  },
  {
    path: "reservations",
    component: ReservationsComponent
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "product-detail",
    component: ProductDetailComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: "cart",
    component: CartComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: "checkout",
    component: CheckoutComponent
  },
  {
    path: "demo",
    component: DemoPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
