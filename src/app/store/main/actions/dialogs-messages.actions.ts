import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'
import { ISelectFn } from '../../interfaces/select-fn.interface'
import { IDialogMessages } from '../interfaces/dialog-messages.interface'
import { DIALOGS_MESSAGES } from '../keys'
import { IMainStoreState } from '../main.store'

export const ADD_DIALOGS_MESSAGES = 'ADD_DIALOG_MESSAGES'

export interface IAddDialogsMessagesDispatchAction {
    type: typeof ADD_DIALOGS_MESSAGES
    payload: {
        receiverID: number
        messages: IMessage[]
    }
}

export const addDialogsMessages = (receiverID: number, ...messages: IMessage[]): IAddDialogsMessagesDispatchAction => {
    return {
        type: ADD_DIALOGS_MESSAGES,
        payload: {
            receiverID,
            messages,
        },
    }
}

export interface IDialogMessagesSelectAction<State, Item> {
    key: typeof DIALOGS_MESSAGES
    selectFn: ISelectFn<State, Item>
}

export const getDialogMessages = (
    receiverID: number
): IDialogMessagesSelectAction<IMainStoreState, IDialogMessages | null> => {
    return {
        key: DIALOGS_MESSAGES,
        selectFn: (state) => {
            const dialogMessages = state[DIALOGS_MESSAGES].find((key) => key.receiverID === receiverID)

            if (!dialogMessages) return null
            return dialogMessages
        },
    }
}
