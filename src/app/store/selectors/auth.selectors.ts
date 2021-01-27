import { ISelectorFn } from '../core/interfaces/selector.interface'
import { IAppState } from '../states/app.state'

export const getUserID = (): ISelectorFn<IAppState, number | null> => {
    return (state) => state.auth.userID
}

export const getAccessToken = (): ISelectorFn<IAppState, string> => {
    return (state) => state.auth.accessToken
}

export const getConnectionError = (): ISelectorFn<IAppState, boolean> => {
    return (state) => state.auth.connectionError
}
