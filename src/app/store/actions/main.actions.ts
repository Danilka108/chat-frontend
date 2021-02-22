import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'
import { IAction } from '../core/interfaces/action.interface'

export const UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION = 'UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION'
type UpdateActiveReceiverIDAction = IAction<typeof UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION, number | null>
export const updateActiveReceiverID = (activeReceiverID: number | null): UpdateActiveReceiverIDAction => {
    return {
        type: UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION,
        payload: activeReceiverID,
    }
}

export const ADD_MAIN_DIALOGS_ACTION = 'ADD_MAIN_DIALOGS_ACTION'
type AddDialogsAction = IAction<typeof ADD_MAIN_DIALOGS_ACTION, IDialog[]>
export const addDialogs = (dialogs: IDialog[]): AddDialogsAction => {
    return {
        type: ADD_MAIN_DIALOGS_ACTION,
        payload: dialogs,
    }
}

export const UPDATE_MAIN_DIALOG_NEW_MESSAGES_COUNT_ACTION = 'UPDATE_DIALOG_NEW_MESSAGES_COUNT_ACTION'
type UpdateDialogNewMessagesCountAction = IAction<
    typeof UPDATE_MAIN_DIALOG_NEW_MESSAGES_COUNT_ACTION,
    {
        receiverID: number
        count: number
    }
>
export const updateDialogNewMessagesCount = (receiverID: number, count: number): UpdateDialogNewMessagesCountAction => {
    return {
        type: UPDATE_MAIN_DIALOG_NEW_MESSAGES_COUNT_ACTION,
        payload: {
            receiverID,
            count,
        },
    }
}

export const UPDATE_DIALOG_NOT_READED_MESSAGES_COUNT_ACTION = 'UPDATE_DIALOG_NOT_READED_MESSAGES_COUNT_ACTION'
type UpdateDialogNotReadedMessagesCountAction = IAction<
    typeof UPDATE_DIALOG_NOT_READED_MESSAGES_COUNT_ACTION,
    {
        receiverID: number
        count: number
    }
>
export const updateDialogsNotReadedMessagesCount = (
    receiverID: number,
    count: number
): UpdateDialogNotReadedMessagesCountAction => {
    return {
        type: UPDATE_DIALOG_NOT_READED_MESSAGES_COUNT_ACTION,
        payload: {
            receiverID,
            count,
        },
    }
}

export const ADD_MAIN_DIALOG_MESSAGES_ACTION = 'ADD_MAIN_DIALOG_MESSAGES_ACTION'
type AddDialogMessagesAction = IAction<
    typeof ADD_MAIN_DIALOG_MESSAGES_ACTION,
    {
        receiverID: number
        messages: IMessage[]
    }
>
export const addDialogMessages = (receiverID: number, messages: IMessage[]): AddDialogMessagesAction => {
    return {
        type: ADD_MAIN_DIALOG_MESSAGES_ACTION,
        payload: {
            receiverID,
            messages,
        },
    }
}

export const UPDATE_MAIN_DIALOG_SCROLL_ACTION = 'UPDATE_MAIN_DIALOG_SCROLL_ACTION'
type UpdateDialogScrollAction = IAction<
    typeof UPDATE_MAIN_DIALOG_SCROLL_ACTION,
    {
        receiverID: number
        scroll: number
    }
>
export const updateDialogScroll = (receiverID: number, scroll: number): UpdateDialogScrollAction => {
    return {
        type: UPDATE_MAIN_DIALOG_SCROLL_ACTION,
        payload: {
            receiverID,
            scroll,
        },
    }
}

export const UPDATE_MAIN_REQUEST_LOADING_ACTION = 'UPDATE_MAIN_REQUEST_LOADING_ACTION'
type UpdateRequestLoadingAction = IAction<typeof UPDATE_MAIN_REQUEST_LOADING_ACTION, boolean>
export const updateRequestLoading = (requestLoading: boolean): UpdateRequestLoadingAction => {
    return {
        type: UPDATE_MAIN_REQUEST_LOADING_ACTION,
        payload: requestLoading,
    }
}

export const UPDATE_MAIN_DIALOG_SKIP_ACTION = 'UPDATE_DIALOG_SKIP_ACTION'
type UpdateDialogSkipAction = IAction<
    typeof UPDATE_MAIN_DIALOG_SKIP_ACTION,
    {
        receiverID: number
        skip: number
    }
>
export const updateDialogSkip = (receiverID: number, skip: number): UpdateDialogSkipAction => {
    return {
        type: UPDATE_MAIN_DIALOG_SKIP_ACTION,
        payload: {
            receiverID,
            skip,
        },
    }
}

export const UPDATE_MAIN_DIALOG_IS_UPLOAD_ACTION = 'UPDATE_MAIN_DIALOG_IS_UPLOAD_ACTION'
type UpdateDialogIsUploadAction = IAction<
    typeof UPDATE_MAIN_DIALOG_IS_UPLOAD_ACTION,
    {
        receiverID: number
        isUpload: boolean
    }
>
export const updateDialogIsUpload = (receiverID: number, isUpload: boolean) => {
    return {
        type: UPDATE_MAIN_DIALOG_IS_UPLOAD_ACTION,
        payload: {
            receiverID,
            isUpload,
        },
    }
}

export type MainActions =
    | UpdateActiveReceiverIDAction
    | AddDialogsAction
    | AddDialogMessagesAction
    | UpdateRequestLoadingAction
    | UpdateDialogScrollAction
    | UpdateDialogSkipAction
    | UpdateDialogIsUploadAction
    | ReturnType<typeof updateDialogsNotReadedMessagesCount>
