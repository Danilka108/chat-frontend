import { createAction, props } from '@ngrx/store'
import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'

export const updateActiveReceiverID = createAction(
    '[Main] Update Active Receiver ID',
    props<{ activeReceiverID: number | null }>()
)

export const updateRequestLoading = createAction('[Main] Update Request Loading', props<{ requestLoading: boolean }>())

export const addDialogs = createAction('[Dialogs] Add Dialogs', props<{ dialogs: IDialog[] }>())

export const updateDialogNewMessagesCount = createAction(
    '[Dialogs] Update Dialog New Messages Count',
    props<{ receiverID: number; newMessagesCount: number }>()
)

export const updateDialogLastMessage = createAction(
    '[Dialogs] Update Dialog Last Message',
    props<{ receiverID: number; lastMessage: string; createdAt: string }>()
)

export const addDialogMessages = createAction(
    '[Dialogs] Add Dialog Messages',
    props<{ receiverID: number; messages: IMessage[] }>()
)

export const updateDialogScroll = createAction(
    '[Dialogs] Update Dialog Scroll',
    props<{ receiverID: number; scroll: number }>()
)

export const updateDialogSkip = createAction(
    '[Dialogs] Update Dialog Skip',
    props<{ receiverID: number; skip: number }>()
)

export const updateDialogIsUploaded = createAction(
    '[Dialogs] Update Dialog Is Updated',
    props<{ receiverID: number; isUploaded: boolean }>()
)

// export const updateActiveReceiverID = createAction(
//     '[Main] Update Active Receiver ID',
//     props<{ activeReceiverID: number | null }>()
// )

// export const addDialogs = createAction('[Main] Add Dialogs', props<{ dialogs: IDialog[] }>())

// export const updateDialogLastMessage = createAction(
//     '[Main] Update Dialog Last Message',
//     props<{ receiverID: number; lastMessage: string; createdAt: string }>()
// )

// export const updateDialogNewMessagesCount = createAction(
//     '[Main] Update Dialog New Messsages Count',
//     props<{ receiverID: number; newMessagesCount: number }>()
// )

// export const addDialogMessages = createAction(
//     '[Main] Add Dialog Messages',
//     props<{ receiverID: number; messages: IMessage[] }>()
// )

// export const updateDialogScroll = createAction(
//     '[Main] Update Dialog Scroll',
//     props<{ receiverID: number; scroll: number }>()
// )

// export const updateDialogSkip = createAction('[Main] Update Dialog Skip', props<{ receiverID: number; skip: number }>())

// export const updateDialogIsUploaded = createAction(
//     '[Main] Update Dialog Is Uploaded',
//     props<{ receiverID: number; isUploaded: boolean }>()
// )
