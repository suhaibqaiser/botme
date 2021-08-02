import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CorpusService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiBaseUrl;

  getCorpus(): Observable<any> {
    const url = `${this.apiBaseUrl}/corpus/list`;
    return this.http.get(url);
  }

  getCorpusDetail(corpusId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/corpus/detail?corpusId=${corpusId}`
    return this.http.get(url);
  }

  updateCorpus(corpus: any): Observable<any> {
    const url = `${this.apiBaseUrl}/corpus/update`
    return this.http.post(url, corpus);
  }
}
