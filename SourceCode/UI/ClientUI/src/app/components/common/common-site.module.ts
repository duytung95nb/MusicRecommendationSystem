import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginDialog } from './dialogs/login-dialog.component';
import { MainNavigationComponent } from './main-nav.component';
import { FooterComponent } from './footer-area.component';
import {MaterialModule } from '../../material.module';

@NgModule({
    declarations: [
        MainNavigationComponent,
        FooterComponent,
        LoginDialog
    ],
    imports: [
        MaterialModule
    ],
    exports: [
        MainNavigationComponent,
        FooterComponent
    ],
    entryComponents: [
        LoginDialog
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CommonSiteModule { }