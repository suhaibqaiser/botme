import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/layout/navbar/navbar.component';
import {SidebarComponent} from './components/layout/sidebar/sidebar.component';
import {ContentComponent} from './components/layout/content/content.component';
import {FooterComponent} from './components/layout/footer/footer.component';
import {ContactComponent} from './components/pages/contact/contact.component';
import {HomeComponent} from './components/pages/home/home.component';
import {LoginComponent} from './components/pages/login/login.component';
import {AuthGuard} from "./auth.guard";
import {WrapperComponent} from './components/layout/wrapper/wrapper.component';
import {FormsModule} from "@angular/forms";
import {TokenInterceptorService} from "./services/token-interceptor.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastModule} from 'primeng/toast';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ConfirmationService, MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {FieldsetModule} from 'primeng/fieldset';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InplaceModule} from 'primeng/inplace';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RestaurantModule} from "./modules/restaurant/restaurant.module";
import {HelperService} from "./services/helper.service";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    ContentComponent,
    FooterComponent,
    ContactComponent,
    HomeComponent,
    LoginComponent,
    WrapperComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    TableModule,
    FieldsetModule,
    ConfirmDialogModule,
    SelectButtonModule,
    InplaceModule,
    InputSwitchModule,
    RestaurantModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [HelperService, Title, AuthGuard, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }, MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
