import { Injectable, Component } from "@angular/core";
import { Song } from "../objects/song";
import { HttpConnector } from "../helper/http.connector";
import { TestDate } from "../objects/date";
import { Observable } from "rxjs/Observable";


@Injectable()
export class SongService{
    private link: string = 'assets/data.json';
    private collaborative: string = 'collaborative';
    private contentBased: string = 'contentbased';
    constructor(private connector: HttpConnector){
    }
    private data: string;
    get(songId:number): Observable<Song>{
        return this.connector.get(this.link)
        .map(res => {
            let songArray = res.json();
            let resultSong = null;
            songArray.forEach(song => {
                if (song.id === songId) {
                    resultSong = song;
                }
            });
            return resultSong;
        });;
    }
    getCollaborativeSongs(userid:string): Observable<Song[]>{
        return this.connector.get(this.link)
        .map(res => res.json());;
    }
    getContentBasedSongs(userid:string): Observable<Song[]>{
        return this.connector.get(this.link)
        .map(res => res.json());;
    }
    getRecommendationsForLoggedInUser(userid: string): Observable<any>{
        return this.connector.get(this.link/*change for specific request*/)
        .map(res => res.json());;
    }
    getRegularCommendation(): Observable<any> {
        return this.connector.get(this.link/*change for specific request*/)
        .map(res => res.json());;
    }
}
