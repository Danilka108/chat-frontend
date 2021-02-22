import { ISelect } from '../core/interfaces/select.interface'
import { IAppState } from '../states/app.state'

export const getUserID = (): ISelect<IAppState, number | null> => {
    return {
        selectorFn: (state) => state.auth.userID,
    }
}

export const getAccessToken = (): ISelect<IAppState, string> => {
    return {
        selectorFn: (state) => state.auth.accessToken,
    }
}

export const getConnectionError = (): ISelect<IAppState, boolean> => {
    return {
        selectorFn: (state) => state.auth.connectionError,
    }
}
