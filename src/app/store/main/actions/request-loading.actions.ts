import { ISelectFn } from '../interfaces/select-fn-interface'
import { REQUEST_LOADING } from '../keys'

export const UPDATE_REQUEST_LOADING = 'UPDATE_REQUEST_LOADING'

export interface IUpdateRequestLoadingSelectAction {
    type: typeof UPDATE_REQUEST_LOADING,
    payload: boolean
}

export const updateRequestLoading = (requestLoading: boolean): IUpdateRequestLoadingSelectAction => {
    return {
        type: UPDATE_REQUEST_LOADING,
        payload: requestLoading
    }
}

export interface IRequestLoadingSelectAction<T> {
    key: typeof REQUEST_LOADING,
    selectFn: ISelectFn<T>
}

export const getRequestLoading = (): IRequestLoadingSelectAction<boolean> => {
    return {
        key: REQUEST_LOADING,
        selectFn: (state) => {
            return state[REQUEST_LOADING]
        }
    }
}