import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpConnector {
    constructor(private http: Http) {

    }
    get(url: string): Observable<any> {
        let headers = new Headers({ 'Accept': 'application/json' });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(url, options);
    }
    post(url: string, body: any): Observable<any> {
        let headers = new Headers({ 'Accept': 'application/json' });
        this.createAuthorizationHeader(headers);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, body, options);
    }
    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Bearer '
            + sessionStorage.getItem('user_token'));
    }
}