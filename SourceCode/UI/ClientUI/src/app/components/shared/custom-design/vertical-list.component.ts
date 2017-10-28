import { Input, Component } from "@angular/core";
import { Song } from "../../../objects/song";

@Component({
    selector: 'vertical-list',
    templateUrl: 'vertical-list.component.html',
    styleUrls: ['custom-design.css']
})

export class VerticalList {
    @Input() title: string;
    @Input() layoutType: String;
    @Input() songs: Song[];
}