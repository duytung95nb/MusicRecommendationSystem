import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SongService } from "../helper/services";
import { Song } from "../objects/song";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    templateUrl: 'song-detail.component.html',
    styleUrls: ['./song-detail.component.css']
})

export class SongDetail implements OnInit, OnDestroy {
    private idSubscribe: any;
    private currentSong: Song;
    private currentIframeSource: SafeUrl;
    private similarSongs: Song[];
    private nextPlaySongs: Song[];
    private loggedInUser: any;
    constructor(private activatedRoute: ActivatedRoute,
        private songService: SongService,
        private sanitizer: DomSanitizer) {
    }
    ngOnInit() {
        if (localStorage.getItem('loggedInInfo')) {
            this.loggedInUser = JSON.parse(localStorage.getItem('loggedInInfo')).userInfo;
        }
        var self = this;
        this.idSubscribe = this.activatedRoute.params.subscribe(params => {
            var loggedInUserId = self.loggedInUser ? self.loggedInUser.id : null;
            self.songService.get(loggedInUserId, params['songId'])
                .subscribe(result => {
                    self.currentSong = result.currentSong;
                    self.currentIframeSource = self.sanitizer.bypassSecurityTrustResourceUrl("https://mp3.zing.vn/embed/song/" + result.currentSong.iframe + "?start=true");
                    self.similarSongs = result.similarSongs;
                    self.nextPlaySongs = result.nextPlaySongs;
                });
        });
    }

    ngOnDestroy() {
        this.idSubscribe.unsubscribe();
    }
}

const images = [
    {
        "id": 1,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 1",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/covered.jpg",
        "listened": 3000
    },
    {
        "id": 2,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 2",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/generation.jpg"
    },
    {
        "id": 3,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 3",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/preschool.jpg",
        "listened": 3000
    },
    {
        "id": 4,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 4",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/potter.jpg",
        "listened": 3000
    },
    {
        "id": 5,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 5",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/generation.jpg",
        "listened": 3000
    },
    {
        "id": 6,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 6",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/covered.jpg",
        "listened": 3000
    },
    {
        "id": 7,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 7",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/potter.jpg",
        "listened": 3000
    },
    {
        "id": 8,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 8",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/preschool.jpg",
        "listened": 3000
    },
    {
        "id": 9,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 9",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/soccer.jpg",
        "listened": 3000
    },
    {
        "id": 10,
        "artist": "Lam Truong",
        "composer": "Dan Truong",
        "name": "Tinh don phuong 10",
        "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/soccer.jpg",
        "listened": 3000
    }

];