import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/pages/home/home.component";
import {MenuComponent} from "./components/pages/menu/menu.component";
import {ReservationsComponent} from "./components/pages/reservations/reservations.component";
import {PrivacyPolicyComponent} from "./components/pages/privacy-policy/privacy-policy.component";
import {SearchMenuComponent} from "./components/pages/search-menu/search-menu.component";
import {ContactUsComponent} from "./components/pages/contact-us/contact-us.component";
import {ProductDetailComponent} from "./components/pages/product-detail/product-detail.component";
import {CartComponent} from "./components/pages/cart/cart.component";
import {CheckoutComponent} from "./components/pages/checkout/checkout.component";
import {AuthenticationGuard} from "./services/authentication.guard";
import {DemoPageComponent} from "./components/pages/demo-page/demo-page.component";
import {LoginComponent} from "./components/pages/login/login.component";
import {ProfileComponent} from "./components/pages/profile/profile.component";
import {SignupComponent} from "./components/pages/signup/signup.component";
import {SuggestionsComponent} from "./components/pages/suggestions/suggestions.component";
import {OrderTypesComponent} from "./components/pages/order-types/order-types.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: "bot-login",
    component: LoginComponent
  },
  {
    path: "menu",
    component: MenuComponent
  },
  {
    path: "online-shop",
    component: SearchMenuComponent
  },
  {
    path: "contact-us",
    component: ContactUsComponent
  },
  {
    path: "reservations",
    component: ReservationsComponent,
    canActivate: [AuthenticationGuard]
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
    component: ProductDetailComponent
  },
  {
    path: "cart",
    component: CartComponent
  },
  {
    path: "checkout",
    component: CheckoutComponent
  },
  {
    path: "demo",
    component: DemoPageComponent
  },
  {
    path: "bot-signup",
    component: SignupComponent
  },
  {
    path: "search-product",
    component: SuggestionsComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: "track-order",
    component: OrderTypesComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
