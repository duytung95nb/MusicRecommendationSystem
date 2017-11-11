import { ActionReducer, Action } from '@ngrx/store';
import { Login, LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, UserActions } from '../actions/UserAction';
import { User } from '../objects/user';

export interface AppState {
    token: string;
    loggedInUserInfo: User
}

const initialState: AppState = {
    token: "",
    loggedInUserInfo: new User(null, null, null, null, null, null, null, null, null)
}

export function userReducer(state = initialState, action: UserActions) {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, { loggedInUserInfo: action.payload });

        case LOGIN_SUCCESS:
            var newState = Object.assign({}, state, {
                token: action.payload.token,
                loggedInUserInfo: action.payload.userInfo
            });
            sessionStorage.setItem("token", action.payload.token);
            console.log(LOGIN_SUCCESS, newState);
            return newState;

        case LOGIN_FAIL:
            return state;

        default:
            return state;
    }
}