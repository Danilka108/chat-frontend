import { ReducersMap } from '../core/interfaces/reducers-map.type'
import { IAppState } from '../states/app.state'
import { authReducer } from './auth.reducer'
import { mainReducer } from './main.reducer'

export const appReducersMap: ReducersMap<IAppState> = {
    main: mainReducer,
    auth: authReducer,
}
