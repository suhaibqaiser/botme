import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private pageHeader: String = "";
  private toggleSideBarObject = {
    check: true,
    addClass: ''
  }

  public getHeader() {
    return this.pageHeader;
  }

  public setHeader(value: String) {
    this.pageHeader = value;
  }

  public getToggleObject() {
    return this.toggleSideBarObject
  }

}
