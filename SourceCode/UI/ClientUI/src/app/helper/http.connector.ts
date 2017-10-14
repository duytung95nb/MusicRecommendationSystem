import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpConnector {
    constructor(private http: Http) {

    }
    get(url: string) {
        return this.http.get(url).map(res => res.json());
    }
    
}