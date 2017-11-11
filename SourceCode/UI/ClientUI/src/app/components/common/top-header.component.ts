import { Component, Input, Inject } from '@angular/core';
import { User } from "../../objects/user";
import { MatDialogRef, MatDialog } from '@angular/material';
import { LoginDialog } from './dialogs/login-dialog.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
    selector: 'top-header',
    templateUrl: 'top-header.component.html',
    styleUrls: ['top-header.component.css']
})

export class TopHeaderComponent {
    private username: string;
    private password: string;
    private user: User;
    animal: string;
    name: string;
    dialogRef: MatDialogRef<LoginDialog>;
    constructor(public dialog: MatDialog, private router: Router, private store: Store<any>) { }
    ngOnInit() {
        var self = this;
        this.store.select(state => state.loggedInUser)
            .subscribe(resultUser => {
                self.user = resultUser;
            });
    }
    onLogoClicked() {
        this.router.navigate(['/']);
    }
    showLoginForm(): void {
        this.dialogRef = this.dialog.open(LoginDialog, LoginDialog.config);

        this.dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.animal = result;
        });
        console.log("Show login dialog!");
    }
}
