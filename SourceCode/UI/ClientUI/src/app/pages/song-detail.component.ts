import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SongService } from "../helper/services";
import { Song } from "../objects/song";

@Component({
    templateUrl: 'song-detail.component.html',
    styleUrls: ['./song-detail.component.css']
})

export class SongDetail implements OnInit, OnDestroy{
    private idSubscribe: any;
    private song: Song;
    constructor(private activatedRoute: ActivatedRoute,
        private songService: SongService) {
    }
    ngOnInit() {
        var self = this;
        this.idSubscribe = this.activatedRoute.params.subscribe(params => {
            self.songService.get(+params['songId']).subscribe((song: Song) => {
                self.song = song;
            });;
            // In a real app: dispatch action to load the details here.
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