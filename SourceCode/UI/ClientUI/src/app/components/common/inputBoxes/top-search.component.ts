import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { MatAutocompleteSelectedEvent } from "@angular/material";

@Component({
    selector: 'top-search',
    templateUrl: 'top-search.component.html',
    styleUrls: ['top-search.component.css']
})

export class TopSearch {
    @Input() options: Array<any>;
    @Input() placeholderText: string;
    @Output() optionSelected: EventEmitter<MatAutocompleteSelectedEvent> = new EventEmitter<MatAutocompleteSelectedEvent>();
    myControl: FormControl = new FormControl();
    myGroup: FormGroup = new FormGroup({
        searchInput: this.myControl
    });

    filteredOptions: Observable<string[]>;

    ngOnInit() {
        var self = this;
        this.filteredOptions = this.myControl.valueChanges
            .startWith(null)
            .map(val => 
                val ? this.filter(val): null);
    }

    filter(val: string): Array<any> {
        return this.options.filter(option =>
            option.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
}