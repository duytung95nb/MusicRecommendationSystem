import {
    MatButtonModule, MatInputModule,
    MatGridListModule, MatProgressSpinnerModule,
    MatDialogModule, MatFormFieldModule, MatSelectModule,
    MatAutocompleteModule, MatCardModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule,
        MatAutocompleteModule, MatCardModule],
    exports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule,
        MatAutocompleteModule, MatCardModule]
})

export class MaterialModule { }
