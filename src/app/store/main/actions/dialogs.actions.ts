import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { ISelectFn } from '../../interfaces/select-fn.interface'
import { DIALOGS } from '../keys'
import { IMainStoreState } from '../main.store'

export const ADD_DIALOGS = 'ADD_DIALOG'

export interface IAddDialogsDispatchAction {
    type: typeof ADD_DIALOGS
    payload: {
        dialogs: IDialog[]
    }
}

export const addDialogs = (...dialogs: IDialog[]): IAddDialogsDispatchAction => {
    return {
        type: ADD_DIALOGS,
        payload: {
            dialogs,
        },
    }
}

export interface IDialogsSelectAction<State, Item> {
    key: typeof DIALOGS
    selectFn: ISelectFn<State, Item>
}

export const getDialogs = (): IDialogsSelectAction<IMainStoreState, IDialog[]> => {
    return {
        key: DIALOGS,
        selectFn: (state) => {
            return state[DIALOGS]
        },
    }
}
