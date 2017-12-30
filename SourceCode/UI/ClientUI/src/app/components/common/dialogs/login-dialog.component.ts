import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../helper/userService';
import { Store, State } from '@ngrx/store';
import { User } from '../../../objects/user';
import { LOGIN, Login } from '../../../actions/UserAction';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../reducers/userReducer';
import 'rxjs/add/operator/distinctUntilChanged';
import { ISubscription } from "rxjs/Subscription";
import { AuthService } from 'angular2-social-login';

@Component({
    selector: 'login-dialog',
    templateUrl: 'login-dialog.component.html',
    styleUrls: ['login-dialog.component.css']
})

export class LoginDialog{
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
    // private token: Observable<string>;
    // private user: Observable<User>;
    // private subscrition: ISubscription;
    constructor(public dialogRef: MatDialogRef<LoginDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService: UserService,
        private authService: AuthService) {

    }

    onLoginClicked(): void {
        // var loginAction = new Login(LOGIN, { username: this.username, password: this.password });
        // this.store.dispatch(loginAction);
        this.userService.login(this.username, this.password)
            .subscribe(response => {
                // login success
                if (response.status === 200) {
                    localStorage.setItem('loggedInInfo', response._body);
                    this.dialogRef.close();
                    window.location.reload();
                }
            });
    }

    onLoginWithFacebookClick(): void {
        //TODO: See what it gonna return, add new user or login user to the system.
        this.authService.login('facebook')
            .subscribe(
                data => {
                    console.log(data);
                    var returnedUserId;
                    this.userService.loginSocial(returnedUserId)
                        .subscribe(response => {
                            // login success
                            if (response.status === 200) {
                                localStorage.setItem('loggedInInfo', response._body);
                                this.dialogRef.close();
                                window.location.reload();
                            }
                        });
                }
            );
    }

    onLoginWithGoogleClick(): void {
        //TODO: See what it gonna return, add new user or login user to the system.
        this.authService.login('google')
            .subscribe(
                data => {
                    console.log(data);
                    var returnedUserId;
                    this.userService.loginSocial(returnedUserId)
                        .subscribe(response => {
                            // login success
                            if (response.status === 200) {
                                localStorage.setItem('loggedInInfo', response._body);
                                this.dialogRef.close();
                                window.location.reload();
                            }
                        });
                }
            );
    }
}