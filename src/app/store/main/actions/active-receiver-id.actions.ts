import { ISelectFn } from '../../interfaces/select-fn.interface'
import { ACTIVE_RECEIVER_ID } from '../keys'
import { IMainStoreState } from '../main.store'

export const DELETE_ACTIVE_RECEIVER_ID = 'DELETE_ACTIVE_RECEIVER_ID'
export const UPDATE_ACTIVE_RECEIVER_ID = 'UPDATE_ACTIVE_RECEIVER_ID'

export interface IUpdateActiveReceiverIDDispatchAction {
    type: typeof UPDATE_ACTIVE_RECEIVER_ID
    payload: number | null
}

export const updateActiveReceiverID = (activeReceiverID: number | null): IUpdateActiveReceiverIDDispatchAction => {
    return {
        type: UPDATE_ACTIVE_RECEIVER_ID,
        payload: activeReceiverID,
    }
}

export interface IActiveReceiverIDSelectAction<State, Item> {
    key: typeof ACTIVE_RECEIVER_ID
    selectFn: ISelectFn<State, Item>
}

export const getActiveReceiverID = (): IActiveReceiverIDSelectAction<IMainStoreState, number | null> => {
    return {
        key: ACTIVE_RECEIVER_ID,
        selectFn: (state) => {
            return state[ACTIVE_RECEIVER_ID]
        },
    }
}
