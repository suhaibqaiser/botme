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
    restaurantId = this.authService.getRestaurantId()
    apiBaseUrl = environment.apiBaseUrl;

    getDevices(): Observable<any> {
        const url = `${this.apiBaseUrl}/device/list?restaurantId=${this.restaurantId}`;
        return this.http.get(url, {headers: this.headers});
      }

    getDeviceDetails(deviceId: string): Observable<any> {
        const url = `${this.apiBaseUrl}/device/detail?deviceId=${deviceId}`;
        return this.http.get(url);
    }

    addDevice(device: any): Observable<any> {
      device.restaurantId = this.restaurantId
      const url = `${this.apiBaseUrl}/device/register`;
      return this.http.put(url,device,{headers: this.headers});
    }

    editDevice(device: any): Observable<any> {
      device.restaurantId = this.restaurantId
      const url = `${this.apiBaseUrl}/device/update?deviceId=${device.deviceId}`;
      const body = { device: device};
      return this.http.post(url, body,{headers: this.headers});
    }
    
    removeDevice(device: any): Observable<any> {
      const url = `${this.apiBaseUrl}/device/remove?deviceId=${device.deviceId}`;
      return this.http.delete(url,{headers: this.headers});
    }
}
