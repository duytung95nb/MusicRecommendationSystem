import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'form-input',
    template: `
                <div>
                    <input #input class="form-control" type="{{type}}" placeholder="{{placeHolder}}" required="{{required}}" (change)="valueChanged()">
                </div>
    `
})

export class FormInputComponent {
    @Input() type: string;
    @Input() placeHolder: string;
    @Input() required: boolean;
    @Output() value = new EventEmitter<string>();
    @ViewChild('input') input: ElementRef;
    valueChanged(){
        this.value.emit(this.input.nativeElement.value);
    }
}