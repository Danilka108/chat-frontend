import { ISelectFn } from '../../interfaces/select-fn.interface'
import { REQUEST_LOADING } from '../keys'
import { IMainStoreState } from '../main.store'

export const UPDATE_REQUEST_LOADING = 'UPDATE_REQUEST_LOADING'

export interface IUpdateRequestLoadingSelectAction {
    type: typeof UPDATE_REQUEST_LOADING
    payload: boolean
}

export const updateRequestLoading = (requestLoading: boolean): IUpdateRequestLoadingSelectAction => {
    return {
        type: UPDATE_REQUEST_LOADING,
        payload: requestLoading,
    }
}

export interface IRequestLoadingSelectAction<State, Item> {
    key: typeof REQUEST_LOADING
    selectFn: ISelectFn<State, Item>
}

export const getRequestLoading = (): IRequestLoadingSelectAction<IMainStoreState, boolean> => {
    return {
        key: REQUEST_LOADING,
        selectFn: (state) => {
            return state[REQUEST_LOADING]
        },
    }
}
