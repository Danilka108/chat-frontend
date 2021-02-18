import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'
import { createAction } from '../core/create-action'
import { IAction } from '../core/interfaces/action.interface'

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

export const UPDATE_MAIN_DIALOG_SCROLL_ACTION = 'UPDATE_MAIN_DIALOG_SCROLL_ACTION'
export const updateDialogScroll = (
    receiverID: number,
    scroll: number
): IAction<
    typeof UPDATE_MAIN_DIALOG_SCROLL_ACTION,
    {
        receiverID: number
        scroll: number
    }
> => {
    return {
        type: UPDATE_MAIN_DIALOG_SCROLL_ACTION,
        payload: {
            receiverID,
            scroll,
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

export const UPDATE_MAIN_DIALOG_SKIP_ACTION = 'UPDATE_DIALOG_SKIP_ACTION'
export const updateDialogSkip = (
    receiverID: number,
    skip: number
): IAction<
    typeof UPDATE_MAIN_DIALOG_SKIP_ACTION,
    {
        receiverID: number
        skip: number
    }
> => {
    return {
        type: UPDATE_MAIN_DIALOG_SKIP_ACTION,
        payload: {
            receiverID,
            skip,
        },
    }
}

export const UPDATE_MAIN_DIALOG_IS_UPLOAD_ACTION = 'UPDATE_MAIN_DIALOG_IS_UPLOAD_ACTION'
export const updateDialogIsUpload = (
    receiverID: number,
    isUpload: boolean
): IAction<typeof UPDATE_MAIN_DIALOG_IS_UPLOAD_ACTION, { receiverID: number; isUpload: boolean }> => {
    return {
        type: UPDATE_MAIN_DIALOG_IS_UPLOAD_ACTION,
        payload: {
            receiverID,
            isUpload,
        },
    }
}

export type MainActions = ReturnType<
    | typeof updateActiveReceiverID
    | typeof addDialogs
    | typeof addDialogMessages
    | typeof updateRequestLoading
    | typeof updateDialogScroll
    | typeof updateDialogSkip
    | typeof updateDialogIsUpload
>
