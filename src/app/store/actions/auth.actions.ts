import { IAction } from '../core/interfaces/action.interface'

export const AUTH_USER_ID_UPDATE_ACTION = 'AUTH_USER_ID_UPDATE_ACTION'
export const updateUserID = (userID: number): IAction<typeof AUTH_USER_ID_UPDATE_ACTION, number> => {
    return {
        type: AUTH_USER_ID_UPDATE_ACTION,
        payload: userID,
    }
}

export const AUTH_ACCESS_TOKEN_UPDATE_ACTION = 'AUTH_ACCESS_TOKEN_UPDATE_ACTION'
export const updateAccessToken = (accessToken: string): IAction<typeof AUTH_ACCESS_TOKEN_UPDATE_ACTION, string> => {
    return {
        type: AUTH_ACCESS_TOKEN_UPDATE_ACTION,
        payload: accessToken,
    }
}

export type AuthActions = ReturnType<typeof updateUserID | typeof updateAccessToken>
