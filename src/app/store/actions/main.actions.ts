import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'
import { IAction } from '../core/interfaces/action.interface'
import { IDialogMessages } from '../interfaces/dialogs-messages.interface'

export const UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION = 'UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION'
export const updateActiveReceiverID = (
    activeReceiverID: number | null
): IAction<typeof UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION, number | null> => {
    return {
        type: UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION,
        payload: activeReceiverID,
    }
}

export const ADD_MAIN_DIALOGS_ACTION = 'ADD_MAIN_DIALOGS_ACTION'
export const addDialogs = (dialogs: IDialog[]): IAction<typeof ADD_MAIN_DIALOGS_ACTION, IDialog[]> => {
    return {
        type: ADD_MAIN_DIALOGS_ACTION,
        payload: dialogs,
    }
}

export const ADD_MAIN_DIALOG_MESSAGES_ACTION = 'ADD_MAIN_DIALOG_MESSAGES_ACTION'
export const addDialogMessages = (
    receiverID: number,
    messages: IMessage[]
): IAction<
    typeof ADD_MAIN_DIALOG_MESSAGES_ACTION,
    {
        receiverID: number
        messages: IMessage[]
    }
> => {
    return {
        type: ADD_MAIN_DIALOG_MESSAGES_ACTION,
        payload: {
            receiverID,
            messages,
        },
    }
}

export const UPDATE_MAIN_REQUEST_LOADING_ACTION = 'UPDATE_MAIN_REQUEST_LOADING_ACTION'
export const updateRequestLoading = (
    requestLoading: boolean
): IAction<typeof UPDATE_MAIN_REQUEST_LOADING_ACTION, boolean> => {
    return {
        type: UPDATE_MAIN_REQUEST_LOADING_ACTION,
        payload: requestLoading,
    }
}

export type MainActions = ReturnType<
    typeof updateActiveReceiverID | typeof addDialogs | typeof addDialogMessages | typeof updateRequestLoading
>
