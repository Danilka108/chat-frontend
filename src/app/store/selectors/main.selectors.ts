import { ISelectorFn } from '../core/interfaces/selector.interface'
import { IAppState } from '../states/app.state'

export const getActiveReceiverID = (): ISelectorFn<IAppState, number | null> => {
    return (state) => state.main.activeReceiverID
}
