import { ISelectFn } from '../../interfaces/select-fn.interface'
import { IAuthStoreState } from '../auth.store'
import { USER_ID } from '../keys'

export const UPDATE_USER_ID = 'UPDATE_USER_ID'

export interface IUpdateUserIDDispatchAction {
    type: typeof UPDATE_USER_ID
    payload: number
}

export const updateUserID = (userID: number): IUpdateUserIDDispatchAction => {
    return {
        type: UPDATE_USER_ID,
        payload: userID,
    }
}

export interface IUserIDSelectAction<State, Item> {
    key: typeof USER_ID
    selectFn: ISelectFn<State, Item>
}

export const getUserID = (): IUserIDSelectAction<IAuthStoreState, number | null> => {
    return {
        key: USER_ID,
        selectFn: (state) => state[USER_ID],
    }
}
