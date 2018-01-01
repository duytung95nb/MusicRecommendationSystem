import {
    MatButtonModule, MatInputModule,
    MatGridListModule, MatProgressSpinnerModule,
    MatDialogModule, MatFormFieldModule, MatSelectModule,
    MatAutocompleteModule, MatCardModule, MatStepperModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule,
        MatAutocompleteModule, MatCardModule, MatStepperModule],
    exports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule,
        MatAutocompleteModule, MatCardModule, MatStepperModule]
})

export class MaterialModule { }
