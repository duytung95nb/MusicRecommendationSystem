import { Action } from '@ngrx/store';

export const LOGIN: string = '[USER] Login';
export const LOGIN_SUCCESS: string = '[USER] Login Success';
export const LOGIN_FAIL: string = '[USER] Login Fail';

export class Login implements Action {
    constructor(public type, public payload: any) { }
}
export class LoginSuccess implements Action {
    readonly type: string = LOGIN_SUCCESS;
    constructor(public payload: any) { }
}
export class LoginFail implements Action {
    readonly type: string = LOGIN_FAIL;
    constructor(public payload: any) { }
}
export type UserActions
    = Login
    | LoginSuccess
    | LoginFail;
