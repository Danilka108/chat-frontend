import { ISelectFn } from '../../interfaces/select-fn.interface'
import { IAuthStoreState } from '../auth.store'
import { ACCESS_TOKEN } from '../keys'

export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN'

export interface IUpdateAccessTokenDispatchAction {
    type: typeof UPDATE_ACCESS_TOKEN
    payload: string
}

export const updateAccessToken = (accessToken: string): IUpdateAccessTokenDispatchAction => {
    return {
        type: UPDATE_ACCESS_TOKEN,
        payload: accessToken,
    }
}

export interface IAccessTokenSelectAction<State, Item> {
    key: typeof ACCESS_TOKEN
    selectFn: ISelectFn<State, Item>
}

export const getAccessToken = (): IAccessTokenSelectAction<IAuthStoreState, string> => {
    return {
        key: ACCESS_TOKEN,
        selectFn: (state) => state[ACCESS_TOKEN],
    }
}
