import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginDialog } from './dialogs/login-dialog.component';
import { TopHeaderComponent } from './top-header.component';
import { FooterComponent } from './footer-area.component';
import {MaterialModule } from '../../material.module';

@NgModule({
    declarations: [
        TopHeaderComponent,
        FooterComponent,
        LoginDialog
    ],
    imports: [
        MaterialModule
    ],
    exports: [
        TopHeaderComponent,
        FooterComponent
    ],
    entryComponents: [
        LoginDialog
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CommonSiteModule { }