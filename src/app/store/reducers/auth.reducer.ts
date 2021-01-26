import { AuthActions, AUTH_ACCESS_TOKEN_UPDATE_ACTION, AUTH_USER_ID_UPDATE_ACTION } from '../actions/auth.actions'
import { IReducerFn } from '../core/interfaces/reducer-fn.interface'
import { IAuthState } from '../states/auth.state'

export const authReducer: IReducerFn<IAuthState, AuthActions> = (state, action) => {
    switch (action.type) {
        case AUTH_USER_ID_UPDATE_ACTION: {
            return {
                ...state,
                userID: action.payload,
            }
        }
        case AUTH_ACCESS_TOKEN_UPDATE_ACTION: {
            return {
                ...state,
                accessToken: action.payload,
            }
        }
        default:
            return state
    }
}
