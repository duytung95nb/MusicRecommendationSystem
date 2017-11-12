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
    private topSongs = images;
    private listenedSongs: any[];
    public collaborativeSongs: any[];
    constructor(private songService: SongService, private activatedRoute: ActivatedRoute) {
    }
    ngOnInit() {
        this.userid = this.activatedRoute.params["value"].id;
        var self = this;
        var isLoggedIn = localStorage.getItem('loggedInInfo');
        if (isLoggedIn) {
            this.user = JSON.parse(localStorage.getItem('loggedInInfo')).userInfo;
            this.songService.getRecommendationsForLoggedInUser(this.user.id).subscribe(returnedResult => {
                self.listenedSongs = returnedResult.listenedSongs;
                self.collaborativeSongs = returnedResult.cfRecommendedSongs
            });
        }
        else {
            this.songService.getRegularCommendation().subscribe(returnedResult => {

            });
        }
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
const collaborativeSongs = [
    {
        "id": 1,
        "name": "Tình đơn phương",
        "artist": "Đan trường",
        "composer": "Đan trường"
    },
    {
        "id": 2,
        "name": "Tình đơn phương",
        "artist": "Đan trường",
        "composer": "Đan trường"
    },
    {
        "id": 3,
        "name": "Tình đơn phương",
        "artist": "Đan trường",
        "composer": "Đan trường"
    },
    {
        "id": 4,
        "name": "Tình đơn phương",
        "artist": "Đan trường",
        "composer": "Đan trường"
    },
    {
        "id": 5,
        "name": "Tình đơn phương",
        "artist": "Đan trường",
        "composer": "Đan trường"
    }
]