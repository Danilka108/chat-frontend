import { ISelect, STORE_I_SELECT_DISCRIMINATOR } from '../core/interfaces/select.interface'
import { IAppState } from '../states/app.state'

export const getUserID = (): ISelect<IAppState, number | null> => {
    return {
        discriminator: STORE_I_SELECT_DISCRIMINATOR,
        selectorFn: (state) => state.auth.userID,
    }
}

export const getAccessToken = (): ISelect<IAppState, string> => {
    return {
        discriminator: STORE_I_SELECT_DISCRIMINATOR,
        selectorFn: (state) => state.auth.accessToken,
    }
}

export const getConnectionError = (): ISelect<IAppState, boolean> => {
    return {
        discriminator: STORE_I_SELECT_DISCRIMINATOR,
        selectorFn: (state) => state.auth.connectionError,
    }
}
