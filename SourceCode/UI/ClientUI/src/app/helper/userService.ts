import { Injectable, Component } from "@angular/core";
import { HttpConnector } from "../helper/http.connector";
import { Observable } from "rxjs/Observable";
import { User } from "../objects/user";


@Injectable()
export class UserService{
    private apiRoute: string = 'http://localhost:5000/api/users';
    constructor(private connector: HttpConnector){
    }
    private data: string;
    login(username:string, password: string): Observable<any>{
        var body = {
            username: username,
            password: password
        }
        return this.connector.post(this.apiRoute + "/login", body);
    }

    loginSocial(user: User): Observable<any> {
        var body = user;
        return this.connector.post(this.apiRoute + "/social-login", body);
    }
}
