import { Component, Input } from '@angular/core';

@Component({
    selector: 'main-carousel',
    templateUrl: './main-carousel.component.html',
    styleUrls: ['./main-carousel.component.css']
})
export class MainCarousel {
    @Input() images;
}