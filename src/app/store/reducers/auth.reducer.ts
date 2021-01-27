import {
    AuthActions,
    UPDATE_AUTH_USER_ID_ACTION,
    UPDATE_AUTH_ACCESS_TOKEN_ACTION,
    UPDATE_AUTH_CONNECTION_ERROR_ACTION,
} from '../actions/auth.actions'
import { IReducerFn } from '../core/interfaces/reducer-fn.interface'
import { IAuthState } from '../states/auth.state'

export const authReducer: IReducerFn<IAuthState, AuthActions> = (state, action) => {
    switch (action.type) {
        case UPDATE_AUTH_USER_ID_ACTION: {
            return {
                ...state,
                userID: action.payload,
            }
        }
        case UPDATE_AUTH_ACCESS_TOKEN_ACTION: {
            return {
                ...state,
                accessToken: action.payload,
            }
        }
        case UPDATE_AUTH_CONNECTION_ERROR_ACTION: {
            return {
                ...state,
                connectionError: action.payload,
            }
        }
        default:
            return state
    }
}
