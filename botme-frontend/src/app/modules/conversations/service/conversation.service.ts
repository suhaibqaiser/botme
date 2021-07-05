import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiBaseUrl;

  getConversationList(sessionId: string ): Observable<any> {
    const url = `${this.apiBaseUrl}/conversation/list`;
    const params = new HttpParams()
      .set('sessionId', sessionId);
    return this.http.get(url, {params});
  }

}
