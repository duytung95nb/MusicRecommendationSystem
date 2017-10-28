import { NgModule } from '@angular/core';
import { MainCarousel } from './custom-design/main-carousel.component';
import { FormInputComponent } from './forms/items/form-input.component';
import { SongComponent } from './custom-design/song.component';
import { CarouselComponent } from './custom-design/carousel.component';
import { ResponseToObject } from './utilities/response-to-object';
import { EllipsisPipe } from './utilities/ellipsis-pipe';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { VerticalList } from './custom-design/vertical-list.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    declarations: [
        MainCarousel,
        FormInputComponent,
        SongComponent,
        CarouselComponent,
        VerticalList,
        EllipsisPipe
    ],
    exports: [
        MainCarousel,
        FormInputComponent,
        SongComponent,
        CarouselComponent,
        VerticalList
    ],
    providers: [ResponseToObject]
})

export class SharedModule { }