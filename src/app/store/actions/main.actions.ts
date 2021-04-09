import { createAction, props } from '@ngrx/store'
import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'

export const updateActiveReceiverID = createAction(
    '[Main] Update Active Receiver ID',
    props<{ activeReceiverID: number | null }>()
)

export const updateRequestLoading = createAction('[Main] Update Request Loading', props<{ requestLoading: boolean }>())

export const addDialogs = createAction('[Dialogs] Add Dialogs', props<{ dialogs: IDialog[] }>())

export const markDialogMessagesAsRead = createAction(
    '[Main] Mark Dialog Messages As Read',
    props<{ receiverID: number }>()
)

export const markDialogMessageAsRead = createAction(
    '[Main] Mark Dialog Message As Read',
    props<{ receiverID: number, messageID: number }>()
)

export const updateDialogNewMessagesCount = createAction(
    '[Main] Update Dialog New Messages Count',
    props<{ receiverID: number, newMessagesCount: number }>()
)

export const decreaseDialogNewMessagesCount = createAction(
    '[Main] Decrease Dialog New Messages Count',
    props<{ receiverID: number }>()
)

export const increaseDialogNewMessagesCount = createAction(
    '[Main] Increase Dialog New Messages Count',
    props<{ receiverID: number }>()
)

export const updateDialogLastMessage = createAction(
    '[Main] Update Dialog Last Message',
    props<{ receiverID: number, lastMessage: string, createdAt: string }>()
)

export const addDialogMessages = createAction(
    '[Main] Add Dialog Messages',
    props<{ receiverID: number, messages: IMessage[] }>()
)

export const updateDialogIsUploaded = createAction(
    '[Main] Update Dialog Is Updated',
    props<{ receiverID: number, isUploaded: boolean }>()
)

export const updateDialogConnectionStatus = createAction(
    '[Main] Update Dialog Connection Status',
    props<{ receiverID: number, connectionStatus: 'online' | 'offline' }>()
)

export const updateReconnectionLoading = createAction(
    '[Main] Update Reconnection Loading',
    props<{ reconnectionLoading: boolean }>()
)

export const updateDialogMessages = createAction(
    '[Main] Update Dialog Messages',
    props<{ receiverID: number, messages: IMessage[] }>()
)