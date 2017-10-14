import {
    MatButtonModule, MatInputModule,
    MatGridListModule, MatProgressSpinnerModule,
    MatDialogModule, MatFormFieldModule, MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule],
    exports: [BrowserAnimationsModule, MatButtonModule,
        MatInputModule, MatGridListModule,
        MatProgressSpinnerModule, MatDialogModule,
        MatFormFieldModule, MatSelectModule]
})

export class MaterialModule { }
