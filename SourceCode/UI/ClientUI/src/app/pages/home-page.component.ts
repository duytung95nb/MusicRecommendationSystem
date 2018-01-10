import { Component, OnInit } from '@angular/core';
import { SongService } from "../helper/services";
import { Song } from "../objects/song";
import { TestDate } from "../objects/date";
import { ActivatedRoute } from "@angular/router";
import { User } from "../objects/user";
import { LISTEN, RATE, ADD_TO_FAVOURITE,DOWNLOAD, SHARE } from "../actions/UserAction";

@Component({
    templateUrl: 'home-page.component.html',
    styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {
    public userid: string;
    public user: any;
    public listenedSongs: any[];
    public mostPopularSongs: Song[];
    public collaborativeSongs: any[];
    public userEventRecommendations: any;
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
                    self.mostPopularSongs = returnedResult.mostPopularSongs;
                    self.listenedSongs = returnedResult.listenedSongs;
                    self.collaborativeSongs = returnedResult.cfRecommendedSongs;
                    self.userEventRecommendations = returnedResult.userEventRecommendations;
                });
        }
        else {
            this.songService.getRegularCommendation().subscribe(returnedResult => {
                self.mostPopularSongs = returnedResult.mostPopularSongs;
            });
        }
    }

    getActionRecommendText(actionType: string) {
        switch(actionType) {
            case RATE:
                return "bình chọn";
            case LISTEN:
                return "nghe";
            case ADD_TO_FAVOURITE:
                return "thêm vào yêu thích";
            case DOWNLOAD:
                return "tải";
            case SHARE:
                return "chia sẻ";
            default:
                return '';
        }
    }
}
