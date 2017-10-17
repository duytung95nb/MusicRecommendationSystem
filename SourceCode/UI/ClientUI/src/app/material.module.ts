import {
    MatButtonModule, MatInputModule,
    MatGridListModule, MatProgressSpinnerModule,
    MatDialogModule, MatFormFieldModule, MatSelectModule,
    MatAutocompleteModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule,
        MatAutocompleteModule],
    exports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule,
        MatAutocompleteModule]
})

export class MaterialModule { }
