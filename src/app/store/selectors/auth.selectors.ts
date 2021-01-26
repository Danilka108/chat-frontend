import { ISelectorFn } from '../core/interfaces/selector.interface'
import { IAppState } from '../states/app.state'

export const getUserID = (): ISelectorFn<IAppState, number | null> => {
    return (state) => state.auth.userID
}
