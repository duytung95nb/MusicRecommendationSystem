import { Injectable, Component } from "@angular/core";
import { HttpConnector } from "../helper/http.connector";
import { Observable } from "rxjs/Observable";
import { User } from "../objects/user";


@Injectable()
export class UserService{
    private apiRoute: string = 'http://localhost:5000/api/users';
    // private apiRoute: string = 'http://198.143.141.37:5000/api/users';
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

    public getInitialData(): Observable<any> {
        return this.connector.get(this.apiRoute + "/initial-data")
            .map(res => res.json());
    }

    public submitInitialData(userId: string, genreIndexesArray: any, artistIndexesArray: any, composerIndexesArray: any): Observable<any> {
        var body = {
            id: userId,
            genreIndexesArray: genreIndexesArray,
            artistIndexesArray: artistIndexesArray,
            composerIndexesArray: composerIndexesArray
        };
        return this.connector.post(this.apiRoute + "/save-initial", body);
    }
}
