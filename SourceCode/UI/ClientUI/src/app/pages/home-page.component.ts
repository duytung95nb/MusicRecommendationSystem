import { Component, OnInit } from '@angular/core';
import { SongService } from "../helper/services";
import { Song } from "../objects/song";
import { TestDate } from "../objects/date";
import { ActivatedRoute } from "@angular/router";
import { User } from "../objects/user";

@Component({
    templateUrl: 'home-page.component.html',
    styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {
    public userid: string;
    public user: any;
    private listenedSongs: any[];
    private mostPopularSongs: Song[];
    public collaborativeSongs: any[];
    constructor(private songService: SongService, private activatedRoute: ActivatedRoute) {
    }
    ngOnInit() {
        this.userid = this.activatedRoute.params["value"].id;
        var self = this;
        var isLoggedIn = localStorage.getItem('loggedInInfo');
        if (isLoggedIn) {
            this.user = JSON.parse(localStorage.getItem('loggedInInfo')).userInfo;
            this.songService.getRecommendationsForLoggedInUser(this.user.id)
                .subscribe(returnedResult => {
                    self.listenedSongs = returnedResult.listenedSongs;
                    self.collaborativeSongs = returnedResult.cfRecommendedSongs;
                });
        }
        else {
            this.songService.getRegularCommendation().subscribe(returnedResult => {
                self.mostPopularSongs = returnedResult.mostPopularSongs;
            });
        }
    }
}
