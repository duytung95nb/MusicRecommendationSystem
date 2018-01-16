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
import { FacebookService } from 'ngx-facebook/dist/esm/providers/facebook';
import { LoginResponse } from 'ngx-facebook';
import { HttpConnector } from '../../../helper/http.connector';
import { Router } from '@angular/router';

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
    public username: string;
    public password: string;
    public newUsername: string;
    public newPassword: string;
    public newPasswordVerifying: string;
    public newFirstname: string;
    public newLastname: string;
    public isRegistering: boolean;
    public hasUserAlready: boolean;
    constructor(public dialogRef: MatDialogRef<LoginDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public userService: UserService,
        public authService: AuthService, 
        public facebook: FacebookService,
        private httpConnector: HttpConnector,
        private router: Router) {
        facebook.init({
            appId      : '121873418213397',
            cookie     : false, 
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.11'
        });

        this.isRegistering = false;
        this.hasUserAlready = false;
    }

    onLoginClicked(): void {
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
        var loginOptions = {
            scope: 'public_profile',
            return_scopes: true,
            enable_profile_selector: true
        }
        var self = this;
        this.facebook.login(loginOptions)
            .then((response: LoginResponse) => {
                self.getUserFacebookProfile(response.authResponse.accessToken)
                    .subscribe((result) => {
                        var registeringUser = new User(result.id,
                                result.id,
                                result.id,
                                result.picture.data.url,
                                result.first_name,
                                result.last_name,
                                null,
                                null,
                                null);
                        self.userService.loginSocial(registeringUser)
                            .subscribe(systemLoggedInResult => {
                                // login success
                                if (systemLoggedInResult.status === 200) {
                                    localStorage.setItem('loggedInInfo', systemLoggedInResult._body);
                                    var loggedInDataObject = JSON.parse(systemLoggedInResult._body);
                                    self.dialogRef.close(systemLoggedInResult);
                                    if (loggedInDataObject.isNewUser) {
                                        self.router.navigate(['init-profile']);
                                    }
                                    else {
                                        window.location.reload();
                                    }
                                }
                            });
                    });
            })
            .catch(e => console.error('Error logging in', e));
    }

    getUserFacebookProfile(accessToken:string):Observable<any>{
        var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name','picture.type(small)'];
        var graphApiUrl = 'https://graph.facebook.com/v2.11/me?fields=' + fields.join(',');

        return this.httpConnector.get(graphApiUrl+'&access_token='+accessToken+'')
                   .map(res => res.json())
                   .catch(err => Observable.throw(err)); 
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

    onRegisterClicked(): void {
        if(this.isRegisterInforValid()) {
            // make request
            var registeringUser = new User("",
                this.newUsername,
                this.newPassword,
                "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
                this.newFirstname,
                this.newLastname,
                null,
                null,
                null);
            var self = this;
            this.userService.register(registeringUser).subscribe(response => {
                if(response.status === 200) {
                    localStorage.setItem('loggedInInfo', response._body);
                    this.dialogRef.close();
                    self.router.navigate(['init-profile']);
                }
                else if (response.status === 400) {
                    self.hasUserAlready = true;
                }
            });
        }
        else {

        }
    }

    isRegisterInforValid(): boolean {
        return this.newUsername !== ""
            && this.newPasswordVerifying === this.newPassword
            && this.newPassword !== "";
    }
}