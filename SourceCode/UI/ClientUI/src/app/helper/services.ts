import { Injectable, Component } from "@angular/core";
import { Song } from "../objects/song";
import { HttpConnector } from "../helper/http.connector";
import { TestDate } from "../objects/date";
import { Observable } from "rxjs/Observable";


@Injectable()
export class SongService {
    private link: string = 'assets/data.json';
    // private homeApiRoute: string = 'http://localhost:5000/api/recommendations/home';
    // private detailApiRoute: string = 'http://localhost:5000/api/recommendations/detail';
    private homeApiRoute: string = 'http://198.143.141.37:5000/api/recommendations/home';
    private detailApiRoute: string = 'http://198.143.141.37:5000/api/recommendations/detail';

    private collaborative: string = 'collaborative';
    private contentBased: string = 'contentbased';
    constructor(private connector: HttpConnector) {
    }
    private data: string;
    get(userId: string, songId: string): Observable<any> {
        var requestedUserId = userId ? userId: 'null';
        return this.connector.get(this.detailApiRoute + "?userId=" + userId + "&" + "songId=" + songId)
            .map(res => res.json());
    }
    getCollaborativeSongs(userid: string): Observable<Song[]> {
        return this.connector.get(this.link)
            .map(res => {
                return res.json();
            });
    }
    getContentBasedSongs(userid: string): Observable<Song[]> {
        return this.connector.get(this.link)
            .map(res => res.json());;
    }
    getRecommendationsForLoggedInUser(userId: string): Observable<any> {
        return this.connector.get(this.homeApiRoute + "?userId=" + userId)
            .map(res => res.json());
    }
    getRegularCommendation(): Observable<any> {
        return this.connector.get(this.homeApiRoute)
            .map(res => res.json());;
    }
}
