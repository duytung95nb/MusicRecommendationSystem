import { Component, Input } from '@angular/core';
import { Song } from "../../../objects/song";
import { Router } from '@angular/router';

@Component({
    selector: 'song',
    templateUrl: 'song.component.html',
    styleUrls: ['./custom-design.css']
})

export class SongComponent{
    @Input() song: Song;
    @Input() indexInList: Number;
    @Input() layoutType: String;
    constructor(private router: Router) {

    }
    onSongClicked(song) {
        this.router.navigate(["song", song.id])
    }
}