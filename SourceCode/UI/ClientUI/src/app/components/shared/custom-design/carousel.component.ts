import { Component, Input } from '@angular/core';
import { Song } from "../../../objects/song";

@Component({
    selector: 'carousel',
    templateUrl: 'carousel.component.html',
    styleUrls: ['./carousel.component.less'],
})

export class CarouselComponent{
    @Input() title: String;
    @Input() songs: Song[];

}