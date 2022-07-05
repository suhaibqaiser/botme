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
import {CustomerSignupComponent} from "./components/pages/customer-signup/customer-signup.component";
import {CustomerLoginComponent} from "./components/pages/customer-login/customer-login.component";

const routes: Routes = [
  {
    path: ":restaurantId/home",
    component: HomeComponent
  },
  {
    path: ":restaurantId/profile",
    component: ProfileComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: ":restaurantId/bot-login",
    component: LoginComponent
  },
  {
    path: ":restaurantId/menu",
    component: MenuComponent
  },
  {
    path: ":restaurantId/online-shop",
    component: SearchMenuComponent
  },
  {
    path: ":restaurantId/contact-us",
    component: ContactUsComponent
  },
  {
    path: ":restaurantId/reservations",
    component: ReservationsComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: ":restaurantId/privacy-policy",
    component: PrivacyPolicyComponent
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: ":restaurantId/product-detail",
    component: ProductDetailComponent
  },
  {
    path: ":restaurantId/cart",
    component: CartComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: ":restaurantId/checkout",
    component: CheckoutComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: ":restaurantId/demo",
    component: DemoPageComponent
  },
  {
    path: ":restaurantId/bot-signup",
    component: SignupComponent
  },
  {
    path: ":restaurantId/search-product",
    component: SuggestionsComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: ":restaurantId/track-order",
    component: OrderTypesComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: ":restaurantId/customer-signup",
    component: CustomerSignupComponent
  },
  {
    path: ":restaurantId/customer-login",
    component: CustomerLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
