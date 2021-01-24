import { DialogsGroupComponent } from 'src/app/routing/sections/main/components/dialogs-group/dialogs-group.component'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'
import { IDialogMessages } from '../interfaces/dialog-messages.interface'
import { ISelectFn } from '../interfaces/select-fn-interface'
import { DIALOGS_MESSAGES } from '../keys'

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

export interface IDialogMessagesSelectActionSync<T> {
    key: typeof DIALOGS_MESSAGES
    selectFn: ISelectFn<T>
}

export interface IDialogMessagesSelectAction<T> {
    key: typeof DIALOGS_MESSAGES
    selectFn: ISelectFn<T>
}

export const getDialogMessages = (receiverID: number): IDialogMessagesSelectAction<IDialogMessages | null> => {
    return {
        key: DIALOGS_MESSAGES,
        selectFn: (state) => {
            const dialogMessages = state[DIALOGS_MESSAGES].find((key) => key.receiverID === receiverID)

            if (!dialogMessages) return null
            return dialogMessages
        },
    }
}
