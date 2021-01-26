import { authInitialState, IAuthState } from './auth.state'
import { IMainState, mainInitialState } from './main.state'

export interface IAppState {
    auth: IAuthState
    main: IMainState
}

export const appInitialState: IAppState = {
    auth: authInitialState,
    main: mainInitialState,
}
