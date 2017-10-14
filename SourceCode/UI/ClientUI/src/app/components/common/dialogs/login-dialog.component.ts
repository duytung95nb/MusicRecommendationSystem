import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'login-dialog',
    templateUrl: 'login-dialog.component.html',
})

export class LoginDialog {
    static config = {
        disableClose: false,
        panelClass: 'custom-overlay-pane-class',
        hasBackdrop: true,
        backdropClass: '',
        minWidth: '300px',
        minHeight: '200px',
        maxWidth: '800px',
        maxHeight: '600px',
        data: {
            message: 'Jazzy jazz jazz'
        }
    };
    constructor(
        public dialogRef: MatDialogRef<LoginDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}