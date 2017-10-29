import { Component, OnInit } from '@angular/core';
import { SongService } from "../helper/services";
import { Song } from "../objects/song";
import { TestDate } from "../objects/date";
import { ResponseToObject } from "../objects/response-to-object";
import { ActivatedRoute } from "@angular/router";
import { User } from "../objects/user";

@Component({
    templateUrl: 'home-page.component.html'
})

export class HomePageComponent implements OnInit {
    public userid: string;
    public collaborativeSongs: any[];
    public contentbasedSongs: any[];
    constructor(private songService: SongService, private activatedRoute: ActivatedRoute) {
    }
    ngOnInit() {
        this.userid = this.activatedRoute.params["value"].id;
        this.collaborativeSongs = collaborativeSongs;
        this.contentbasedSongs = collaborativeSongs;
        // get collaborative songs
        // this.songService.getCollaborativeSongs(this.userid)
        //     .subscribe(
        //     data => this.collaborativeSongs = data
        //     );
        // get contentbased songs
        // this.songService.getContentBasedSongs(this.userid)
        //     .subscribe(
        //     data => this.contentbasedSongs = data
        //     );
    }
}

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