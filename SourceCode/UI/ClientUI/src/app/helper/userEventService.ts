import { Injectable, Component } from "@angular/core";
import { HttpConnector } from "../helper/http.connector";
import { Observable } from "rxjs/Observable";
import { User } from "../objects/user";
import { UserEvent } from "../objects/userEvent";


@Injectable()
export class UserEventService {
    private apiRoute: string = 'http://localhost:5000/api/userEvent/log';
    constructor(private connector: HttpConnector) {
    }
    private data: string;
    logUserEvent(userEvent: UserEvent): Observable<any> {
        var requestBody = userEvent;
        return this.connector.post(this.apiRoute, requestBody)
            .map(res => res.json());
    }
}
