import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginDialog } from './dialogs/login-dialog.component';
import { TopHeaderComponent } from './top-header.component';
import { FooterComponent } from './footer-area.component';
import {
    ReactiveFormsModule,
    FormsModule
} from '@angular/forms';
import { TopSearch } from './inputBoxes/top-search.component';
import { MaterialModule } from '../../material.module';

@NgModule({
    declarations: [
        TopHeaderComponent,
        FooterComponent,
        LoginDialog,
        TopSearch
    ],
    imports: [
        ReactiveFormsModule,
        MaterialModule
    ],
    exports: [
        TopHeaderComponent,
        FooterComponent,
        FormsModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        LoginDialog
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CommonSiteModule { }