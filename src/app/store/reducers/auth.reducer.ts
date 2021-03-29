import { createReducer, on } from '@ngrx/store'
import { updateAccessToken, updateConnectionError, updateUserID, updateUserName } from '../actions/auth.actions'
import { authInitialState } from '../state/auth.state'

export const authReducer = createReducer(
    authInitialState,
    on(updateUserID, (state, { userID }) => ({ ...state, userID })),
    on(updateAccessToken, (state, { accessToken }) => ({ ...state, accessToken })),
    on(updateConnectionError, (state, { connectionError }) => ({ ...state, connectionError })),
    on(updateUserName, (state, { userName }) => ({ ...state, userName }))
)
