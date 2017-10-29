import { Injectable, Component } from "@angular/core";
import { Song } from "../objects/song";
import { HttpConnector } from "../helper/http.connector";
import { TestDate } from "../objects/date";
import { Observable } from "rxjs/Observable";


@Injectable()
export class SongService{
    private link: string = 'http://192.168.1.74:8080/project/music_recommendation/';
    private collaborative: string = 'collaborative';
    private contentBased: string = 'contentbased';
    constructor(private connector: HttpConnector){
        
    }
    private data: string;
    getCollaborativeSongs(userid:string): Observable<Song[]>{
        var requestApi = this.link + this.collaborative + '?' + 'userid='+userid;
        return this.connector.get(requestApi)
        .map(response => response as Song[]);
    }
    
    getContentBasedSongs(userid:string): Observable<Song[]>{
        var requestApi = this.link + this.contentBased + '?' + 'userid='+userid;
        return this.connector.get(requestApi)
        .map(response => response as Song[]);
    }
    getDate() {
        return this.connector.get('http://date.jsontest.com');
    }
    testGetDate(): Observable<TestDate> {
        return this.connector.get('http://date.jsontest.com')
        .map(response => response as TestDate);
    }
}
