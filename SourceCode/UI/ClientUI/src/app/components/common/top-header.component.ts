import { Component, Input, Inject, OnInit } from '@angular/core';
import { User } from "../../objects/user";
import { MatDialogRef, MatDialog } from '@angular/material';
import { LoginDialog } from './dialogs/login-dialog.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/userReducer';

@Component({
    selector: 'top-header',
    templateUrl: 'top-header.component.html',
    styleUrls: ['top-header.component.css']
})

export class TopHeaderComponent implements OnInit {
    public loggedInInfo: any;
    public loggedInUser: User;
    public isShowUserMenu: boolean;
    dialogRef: MatDialogRef<LoginDialog>;
    constructor(public dialog: MatDialog, private router: Router) {
        this.loggedInInfo = localStorage.getItem('loggedInInfo');
        if (this.loggedInInfo) {
            this.loggedInUser = JSON.parse(this.loggedInInfo).userInfo;
            this.isShowUserMenu = false;
        }
    }
    ngOnInit() {
    }
    onLogoClicked() {
        this.router.navigate(['/']);
    }
    onUserClicked(): void {
        this.isShowUserMenu = !this.isShowUserMenu;
    }
    onLogoutClicked(): void {
        localStorage.removeItem('loggedInInfo');
        window.location.reload();
    }
    showLoginForm(): void {
        this.dialogRef = this.dialog.open(LoginDialog, LoginDialog.config);
        this.dialogRef.afterClosed()
        .subscribe(systemLoggedInResult => {
            console.log("systemLoggedInResult", systemLoggedInResult);
        });
    }
}
