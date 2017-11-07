import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../helper/userService';

@Component({
    selector: 'login-dialog',
    templateUrl: 'login-dialog.component.html',
    styleUrls: ['login-dialog.component.css']
})

export class LoginDialog {
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
    constructor(public dialogRef: MatDialogRef<LoginDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService: UserService) {

    }

    onLoginClicked(): void {
        var returnedUser = this.userService.login(this.username, this.password);
        console.log(returnedUser);
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

}