import { ISelectFn } from '../../interfaces/select-fn.interface'
import { IAuthStoreState } from '../auth.store'
import { CONNECTION_ERROR } from '../keys'

export const UPDATE_CONNECTION_ERROR = 'UPDATE_CONNECTION_ERROR'

export interface IUpdateConnectionErrorDispatchAction {
    type: typeof UPDATE_CONNECTION_ERROR
    payload: boolean
}

export const updateConnectionError = (connectionError: boolean): IUpdateConnectionErrorDispatchAction => {
    return {
        type: UPDATE_CONNECTION_ERROR,
        payload: connectionError,
    }
}

export interface IConnectionErrorSelectAction<State, Item> {
    key: typeof CONNECTION_ERROR
    selectFn: ISelectFn<State, Item>
}

export const getConnectionError = (): IConnectionErrorSelectAction<IAuthStoreState, boolean> => {
    return {
        key: CONNECTION_ERROR,
        selectFn: (state) => state[CONNECTION_ERROR],
    }
}
