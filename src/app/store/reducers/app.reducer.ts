import { authKey } from '../state/auth.state'
import { mainKey } from '../state/main.state'
import { authReducer } from './auth.reducer'
import { mainReducer } from './main.reducer'

export const appReducer = {
    [authKey]: authReducer,
    [mainKey]: mainReducer,
}
