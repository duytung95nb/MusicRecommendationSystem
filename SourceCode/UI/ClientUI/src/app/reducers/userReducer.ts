import { ActionReducer, Action } from '@ngrx/store';
import { Login, LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, UserActions } from '../actions/UserAction';

export var initialUserState = {
    loggedInUser: {
        token: "",
        userInfo: {
            username: "",
            password: ""
        }
    }
}

export function userReducer(state = initialUserState, action: UserActions) {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, { loggedInUser: action.payload });

        case LOGIN_SUCCESS:
            return Object.assign({}, state, { loggedInUser: action.payload });

        case LOGIN_FAIL:
            return state;

        default:
            return state;
    }
}