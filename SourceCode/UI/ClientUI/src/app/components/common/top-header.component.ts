import { Component, Input, Inject } from '@angular/core';
import {FormControl } from '@angular/forms';
import { User } from "../../objects/user";
import { MatDialogRef, MatDialog } from '@angular/material';
import { LoginDialog } from './dialogs/login-dialog.component';

@Component({
    selector: 'top-header',
    templateUrl: 'top-header.component.html',
    styleUrls: ['top-header.component.css']
})

export class TopHeaderComponent {
    private username: string;
    private password: string;
    animal: string;
    name: string;
    myControl: FormControl = new FormControl();
    options = [
        'One',
        'Two',
        'Three'
    ];
    dialogRef: MatDialogRef<LoginDialog>;
    constructor(public dialog: MatDialog) { }

    showLoginForm(): void {
        this.dialogRef = this.dialog.open(LoginDialog, LoginDialog.config);

        this.dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.animal = result;
        });
        console.log("Show login dialog!");
    }
}
