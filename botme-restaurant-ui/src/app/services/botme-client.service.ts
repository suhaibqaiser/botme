import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class BotmeClientService {
  botMeClientBaseURL = environment.botMeClientAPI;
  deviceInfo: any;

  constructor(private deviceService: DeviceDetectorService, private cookieService: CookieService, private http: HttpClient) {

  }

  loginBotMeClientApi(obj: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${'ea2d3aeaad77865f9769974a920892f5'}`
    })
    const url = `${this.botMeClientBaseURL}/client/auth`;
    //
    console.log(JSON.parse(JSON.stringify(obj.clientSecret)))
    obj.clientSecret = Md5.hashStr(JSON.parse(JSON.stringify(obj.clientSecret)))
    //
    return this.http.post(url, obj, { headers: headers });
  }

  logutAPI(sessionId: any): Observable<any> {
    let body = { sessionId: sessionId }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${'ea2d3aeaad77865f9769974a920892f5'}`
    })
    const url = `${this.botMeClientBaseURL}/session/logoutSession`;
    return this.http.post(url, body, { headers: headers });
  }

  getCookie() {
    return this.cookieService.getAll()
  }

  setCookie(key: any, cookie: any) {
    this.cookieService.set(key, cookie, 30)
  }

  reSetCookie() {

    this.cookieService.deleteAll()
  }

  isCookieTokenValid() {
    return !!this.cookieService.get('clientToken')
  }

  getCookieToken() {
    return this.cookieService.get('clientToken')
  }

  getVoiceType() {
    return this.cookieService.get('voiceType')
  }

  getVoiceTimeout() {
    return this.cookieService.get('voiceTimeout')
  }

  getCookieByKey(key: any) {
    return this.cookieService.get(key)
  }

  isRobotAuth() {
    return (this.deviceService.isTablet())
  }

 signupBotMeClientApi(obj: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${'ea2d3aeaad77865f9769974a920892f5'}`
    })
    const url = `${this.botMeClientBaseURL}/client/register`;
    //
    obj.clientSecret = Md5.hashStr(obj.clientSecret)
    //
    return this.http.put(url, obj, { headers: headers });
  }
}
