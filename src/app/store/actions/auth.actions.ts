import { IAction } from '../core/interfaces/action.interface'

export const UPDATE_AUTH_USER_ID_ACTION = 'AUTH_USER_ID_UPDATE_ACTION'
export const updateUserID = (userID: number): IAction<typeof UPDATE_AUTH_USER_ID_ACTION, number> => {
    return {
        type: UPDATE_AUTH_USER_ID_ACTION,
        payload: userID,
    }
}

export const UPDATE_AUTH_ACCESS_TOKEN_ACTION = 'UPDATE_AUTH_ACCESS_TOKEN_ACTION'
export const updateAccessToken = (accessToken: string): IAction<typeof UPDATE_AUTH_ACCESS_TOKEN_ACTION, string> => {
    return {
        type: UPDATE_AUTH_ACCESS_TOKEN_ACTION,
        payload: accessToken,
    }
}

export const UPDATE_AUTH_CONNECTION_ERROR_ACTION = 'UPDATE_AUTH_CONNECTION_ERROR_ACTION'
export const updateConnectionError = (
    connectionError: boolean
): IAction<typeof UPDATE_AUTH_CONNECTION_ERROR_ACTION, boolean> => {
    return {
        type: UPDATE_AUTH_CONNECTION_ERROR_ACTION,
        payload: connectionError,
    }
}

export type AuthActions = ReturnType<typeof updateUserID | typeof updateAccessToken | typeof updateConnectionError>
