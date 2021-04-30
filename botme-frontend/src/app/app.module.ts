import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'

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
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [Title, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
