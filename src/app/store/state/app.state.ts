import { authInitialState, authKey, AuthState } from './auth.state'
import { MainState, mainInitialState, mainKey } from './main.state'

export interface AppState {
    [authKey]: AuthState
    [mainKey]: MainState
}

export const appInitialState: AppState = {
    [authKey]: authInitialState,
    [mainKey]: mainInitialState,
}
