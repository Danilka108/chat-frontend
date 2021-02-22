import { IAction } from '../core/interfaces/action.interface'

export const UPDATE_AUTH_USER_ID_ACTION = 'AUTH_USER_ID_UPDATE_ACTION'
type UpdateUserIDAction = IAction<typeof UPDATE_AUTH_USER_ID_ACTION, number>

export const updateUserID = (userID: number): UpdateUserIDAction => {
    return {
        type: UPDATE_AUTH_USER_ID_ACTION,
        payload: userID,
    }
}

export const UPDATE_AUTH_ACCESS_TOKEN_ACTION = 'UPDATE_AUTH_ACCESS_TOKEN_ACTION'
type UpdateAccessTokenAction = IAction<typeof UPDATE_AUTH_ACCESS_TOKEN_ACTION, string>

export const updateAccessToken = (accessToken: string): UpdateAccessTokenAction => {
    return {
        type: UPDATE_AUTH_ACCESS_TOKEN_ACTION,
        payload: accessToken,
    }
}

export const UPDATE_AUTH_CONNECTION_ERROR_ACTION = 'UPDATE_AUTH_CONNECTION_ERROR_ACTION'
type UpdateConnectionErrorAction = IAction<typeof UPDATE_AUTH_CONNECTION_ERROR_ACTION, boolean>

export const updateConnectionError = (connectionError: boolean): UpdateConnectionErrorAction => {
    return {
        type: UPDATE_AUTH_CONNECTION_ERROR_ACTION,
        payload: connectionError,
    }
}

export type AuthActions = UpdateUserIDAction | UpdateAccessTokenAction | UpdateConnectionErrorAction
