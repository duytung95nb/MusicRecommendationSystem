import { Component, Input, Inject } from '@angular/core';
import { User } from "../../objects/user";
import { MatDialogRef, MatDialog } from '@angular/material';
import { LoginDialog } from './dialogs/login-dialog.component';

@Component({
    selector: 'main-navigation',
    templateUrl: 'main-nav.component.html'
})

export class MainNavigationComponent {
    private username: string;
    private password: string;
    animal: string;
    name: string;
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
