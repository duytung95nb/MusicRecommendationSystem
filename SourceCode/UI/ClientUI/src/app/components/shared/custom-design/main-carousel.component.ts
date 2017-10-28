import { Component, Input } from '@angular/core';

@Component({
    selector: 'main-carousel',
    templateUrl: './main-carousel.component.html',
    styleUrls: ['./custom-design.css']
})
export class MainCarousel {
    @Input() images;
}