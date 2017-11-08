import { Injectable, Component } from "@angular/core";
import { HttpConnector } from "../helper/http.connector";
import { Observable } from "rxjs/Observable";
import { User } from "../objects/user";


@Injectable()
export class UserService{
    private apiRoute: string = 'http://localhost:4200/api/users';
    constructor(private connector: HttpConnector){
    }
    private data: string;
    login(username:string, password: string): Observable<User>{
        var body = {
            username: username,
            password: password
        }
        return this.connector.post(this.apiRoute + "/login", body)
        .map(user => {
            return user;
        });;
    }
}
