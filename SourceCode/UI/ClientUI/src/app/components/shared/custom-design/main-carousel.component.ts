import { Component, Input } from '@angular/core';
import { Song } from '../../../objects/song';
import { Router } from '@angular/router';

@Component({
    selector: 'main-carousel',
    templateUrl: './main-carousel.component.html',
    styleUrls: ['./custom-design.css']
})
export class MainCarousel {
    @Input() mostPopularSongs: Song[];
    constructor(private router:Router) {

    }
    onSongClicked(song) {
        this.router.navigate(["song", song.id])
    }
}