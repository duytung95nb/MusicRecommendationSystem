import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { of } from 'rxjs/observable/of';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { UserService } from '../helper/userService';
import { LOGIN, LOGIN_SUCCESS, LOGIN_FAIL } from '../actions/UserAction';

@Injectable()
export class UserEffects {
    constructor(
        private actions: Actions,
        private userService: UserService
    ) { }
    @Effect() login$ = this.actions.ofType(LOGIN)
        .map(toPayload)
        .switchMap(
        payload => {
            return this.userService.login(payload.username, payload.password)
            // If successful, dispatch success action with result
            .map(res => ({ type: LOGIN_SUCCESS, payload: res.json() }))
            // If request fails, dispatch failed action
            .catch(() => Observable.of({ type: LOGIN_FAIL }))
        }
        );
}