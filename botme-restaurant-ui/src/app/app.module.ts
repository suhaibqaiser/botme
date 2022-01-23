import {Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {AppRoutingModule} from './app-routing.module';
import {environment} from '../environments/environment'
import {AppComponent} from './app.component';
import {HomeComponent} from './components/pages/home/home.component';
import {ReservationsComponent} from './components/pages/reservations/reservations.component';
import {SearchMenuComponent} from './components/pages/search-menu/search-menu.component';
import {CheckoutComponent} from './components/pages/checkout/checkout.component';
import {HeaderComponent} from './components/layout/header/header.component';
import {FooterComponent} from './components/layout/footer/footer.component';
import {NavbarComponent} from './components/layout/navbar/navbar.component';
import {SidebarComponent} from './components/layout/sidebar/sidebar.component';
import {ContentComponent} from './components/layout/content/content.component';
import {PreloaderComponent} from './components/layout/preloader/preloader.component';
import {TopbarComponent} from './components/layout/topbar/topbar.component';
import {WelcomeSectionComponent} from './components/sections/welcome-section/welcome-section.component';
import {TopbannerComponent} from './components/layout/topbanner/topbanner.component';
import {MenuSectionComponent} from './components/sections/menu-section/menu-section.component';
import {StepsSectionComponent} from './components/sections/steps-section/steps-section.component';
import {SpecialSectionComponent} from './components/sections/special-section/special-section.component';
import {ComboSectionComponent} from './components/sections/combo-section/combo-section.component';
import {DownloadSectionComponent} from './components/sections/download-section/download-section.component';
import {TestimonialSectionComponent} from './components/sections/testimonial-section/testimonial-section.component';
import {VideoSectionComponent} from './components/sections/video-section/video-section.component';
import {BlogSectionComponent} from './components/sections/blog-section/blog-section.component';
import {SubscribeSectionComponent} from './components/sections/subscribe-section/subscribe-section.component';
import {ProductCartModalComponent} from './components/modals/product-cart-modal/product-cart-modal.component';
import {MenuComponent} from './components/pages/menu/menu.component';
import {BookingSectionComponent} from './components/sections/booking-section/booking-section.component';
import {HeadingbannerComponent} from './components/layout/headingbanner/headingbanner.component';
import {
  PrivacyPolicySectionComponent
} from './components/sections/privacy-policy-section/privacy-policy-section.component';
import {PrivacyPolicyComponent} from './components/pages/privacy-policy/privacy-policy.component';
import {SearchGridSectionComponent} from './components/sections/search-grid-section/search-grid-section.component';
import {ContactSectionComponent} from './components/sections/contact-section/contact-section.component';
import {MapSectionComponent} from './components/sections/map-section/map-section.component';
import {ContactUsComponent} from './components/pages/contact-us/contact-us.component';
import {SpeechService} from "./services/speech.service";
import {HttpClientModule} from '@angular/common/http';
import {SofiaBotComponent} from './components/sections/sofia-bot/sofia-bot.component';
import {ProductDetailComponent} from './components/pages/product-detail/product-detail.component';
import {
  ProductDetailSectionComponent
} from './components/sections/product-detail-section/product-detail-section.component';
import {CartComponent} from './components/pages/cart/cart.component';
import {CartSectionComponent} from './components/sections/cart-section/cart-section.component';
import {CheckoutSectionComponent} from './components/sections/checkout-section/checkout-section.component';
import {SpinnerComponent} from './components/layout/spinner/spinner.component';
import {ProgressLoaderComponent} from "./components/sections/progress-loader/progress-loader.component";
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {
  CustomizeProductModalComponent
} from './components/sections/customize-product-modal/customize-product-modal.component';
import {SocketService} from './services/socket.service';
import {BotmeClientService} from "./services/botme-client.service";
import {WindowService} from './services/window.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ReservationService} from "./services/reservation.service";
import {DemoPageComponent} from './components/pages/demo-page/demo-page.component';
import {HelperService} from "./services/helper.service";
import {MicrophoneComponent} from './components/sections/microphone/microphone.component';
import {ContextService} from "./services/context.service";
import { LoginComponent } from './components/pages/login/login.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { LoginFormComponent } from './components/sections/login-form/login-form.component';
import { ProfileSectionComponent } from './components/sections/profile-section/profile-section.component';
import { OrderSectionComponent } from './components/sections/order-section/order-section.component';
import {OrderService} from "./services/order.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReservationsComponent,
    SearchMenuComponent,
    CheckoutComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ContentComponent,
    PreloaderComponent,
    TopbarComponent,
    WelcomeSectionComponent,
    TopbannerComponent,
    MenuSectionComponent,
    StepsSectionComponent,
    SpecialSectionComponent,
    ComboSectionComponent,
    DownloadSectionComponent,
    TestimonialSectionComponent,
    VideoSectionComponent,
    BlogSectionComponent,
    ProgressLoaderComponent,
    SubscribeSectionComponent,
    ProductCartModalComponent,
    MenuComponent,
    BookingSectionComponent,
    HeadingbannerComponent,
    PrivacyPolicySectionComponent,
    PrivacyPolicyComponent,
    SearchGridSectionComponent,
    ContactSectionComponent,
    MapSectionComponent,
    ContactUsComponent,
    SofiaBotComponent,
    ProductDetailComponent,
    ProductDetailSectionComponent,
    CartComponent,
    CartSectionComponent,
    CheckoutSectionComponent,
    SpinnerComponent,
    CustomizeProductModalComponent,
    DemoPageComponent,
    MicrophoneComponent,
    LoginComponent,
    ProfileComponent,
    LoginFormComponent,
    ProfileSectionComponent,
    OrderSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    DragDropModule
  ],
  providers: [OrderService,ContextService, HelperService, ReservationService, SpeechService, BotmeClientService, SocketService, WindowService],
  bootstrap: [AppComponent],
  entryComponents: [CustomizeProductModalComponent]
})
export class AppModule {
}
