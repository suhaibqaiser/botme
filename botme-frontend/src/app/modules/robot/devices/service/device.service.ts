import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class DeviceService {

     headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${'ea2d3aeaad77865f9769974a920892f5'}`
      })
    constructor(private http: HttpClient, private authService: AuthenticationService) {
    }

    deviceId = this.authService.getDeviceId()
    apiBaseUrl = environment.apiBaseUrl;

    getDevices(): Observable<any> {
        const url = `${this.apiBaseUrl}/device/list`;
        return this.http.get(url, {headers: this.headers});
      }

    getDeviceDetails(deviceLabel: string): Observable<any> {
        const url = `${this.apiBaseUrl}/device/detail?deviceId=${deviceLabel}`;
        return this.http.get(url);
    }

    addDevice(device: object): Observable<any> {
        const url = `${this.apiBaseUrl}/device/register`;
        return this.http.put(url,device,{headers: this.headers});
      }

      editDevice(device: object): Observable<any> {
        const url = `${this.apiBaseUrl}/device`;
        const body = { device: device, deviceId: this.deviceId };
        return this.http.post(url, body,{headers: this.headers});
      }
    
      removeDevice(deviceId: string): Observable<any> {
        const url = `${this.apiBaseUrl}/food/category/remove?deviceId=${deviceId}`;
        return this.http.delete(url,{headers: this.headers});
      }
}
