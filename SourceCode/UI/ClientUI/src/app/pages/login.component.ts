import { Component } from '@angular/core';
import {Router } from '@angular/router';

@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent{
    private userid:string = "1";
    constructor(private router: Router){

    }
    onClicked(){
        this.router.navigate(['/home', this.userid]);
    }
    onUserId(userid : string){
        this.userid = userid;
    }
}