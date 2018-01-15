import {
    MatButtonModule, MatInputModule,
    MatGridListModule, MatProgressSpinnerModule,
    MatDialogModule, MatFormFieldModule, MatSelectModule,
    MatAutocompleteModule, MatCardModule, MatStepperModule, MatMenuModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule,
        MatAutocompleteModule, MatCardModule, MatStepperModule,
        MatMenuModule],
    exports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule,
        MatAutocompleteModule, MatCardModule, MatStepperModule,
        MatMenuModule]
})

export class MaterialModule { }
