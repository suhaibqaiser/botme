import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CorpusService {

  constructor(private http: HttpClient) {
  }

  apiBaseUrl = environment.apiBaseUrl;

  getCorpus(): Observable<any> {
    const url = `${this.apiBaseUrl}/nlp/corpus`;
    return this.http.get(url);
  }

  getCorpusDetail(corpusId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/nlp/corpusbyid?corpusId=${corpusId}`
    return this.http.get(url);
  }

  addCorpus(corpus: any): Observable<any> {
    const url = `${this.apiBaseUrl}/nlp/addcorpus`
    return this.http.post(url, corpus);
  }

  updateCorpus(corpus: any): Observable<any> {
    const url = `${this.apiBaseUrl}/nlp/updatecorpus`
    let body = { corpus: corpus };
    console.log(body);
    return this.http.post(url, body);
  }
}
