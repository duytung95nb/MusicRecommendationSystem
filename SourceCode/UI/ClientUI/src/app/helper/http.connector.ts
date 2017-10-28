import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpConnector {
    constructor(private http: Http) {

    }
    get(url: string): Observable<any> {
        return this.http.get(url);
    }
    
}