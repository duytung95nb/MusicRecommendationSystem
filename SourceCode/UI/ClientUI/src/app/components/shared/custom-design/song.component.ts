import { Component, Input } from '@angular/core';
import { Song } from "../../../objects/song";

@Component({
    selector: 'song',
    templateUrl: 'song.component.html'
})

export class SongComponent{
    @Input() song: Song;
}