import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../helper/userService';
import { Store, State } from '@ngrx/store';
import { User } from '../../../objects/user';
import { LOGIN, Login } from '../../../actions/UserAction';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../reducers/userReducer';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    selector: 'login-dialog',
    templateUrl: 'login-dialog.component.html',
    styleUrls: ['login-dialog.component.css']
})

export class LoginDialog implements OnInit {
    static config = {
        disableClose: false,
        hasBackdrop: true,
        backdropClass: '',
        width: '500',
        height: '300px',
        maxWidth: '600px',
        maxHeight: '400px'
    };
    private username: string;
    private password: string;
    private token: Observable<string>;
    private user: Observable<User>;
    constructor(public dialogRef: MatDialogRef<LoginDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private store: Store<AppState>) {

    }

    ngOnInit() {
        this.user = this.store.select<User>(state => state.loggedInUserInfo);
        this.token = this.store.select<string>(state => state.token);
        var self = this;
        this.token.subscribe(tokenString => {
            if (tokenString !== undefined) {
                self.dialogRef.close();
            }
            console.log(tokenString);
        });
    }
    onLoginClicked(): void {
        var loginAction = new Login(LOGIN, { username: this.username, password: this.password });
        this.store.dispatch(loginAction);
        var self = this;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

}