import { Component } from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'top-search',
    templateUrl: 'top-search.component.html',
    styleUrls: ['top-search.component.css']
})

export class TopSearch {
    myControl: FormControl = new FormControl();
    myGroup: FormGroup = new FormGroup({
        searchInput: this.myControl
    });
    options = [
        'One',
        'Two',
        'Three'
    ];

    filteredOptions: Observable<string[]>;

    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges
            .startWith(null)
            .map(val => val ? this.filter(val) : this.options.slice());
    }

    filter(val: string): string[] {
        return this.options.filter(option =>
            option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
}