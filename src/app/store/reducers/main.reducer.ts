import { createReducer, on } from '@ngrx/store'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'
import {
    addDialogMessages,
    addDialogs,
    markDialogMessagesAsRead,
    updateActiveReceiverID,
    updateDialogConnectionStatus,
    updateDialogIsUploaded,
    updateDialogLastMessage,
    updateDialogNewMessagesCount,
    updateRequestLoading,
} from '../actions/main.actions'
import { mainInitialState } from '../state/main.state'

export const mainReducer = createReducer(
    mainInitialState,
    on(updateActiveReceiverID, (state, { activeReceiverID }) => ({
        ...state,
        activeReceiverID,
    })),
    on(updateRequestLoading, (state, { requestLoading }) => {
        return {
            ...state,
            requestLoading,
        }
    }),
    on(addDialogs, (state, { dialogs }) => {
        const stateDialogs = state.dialogs === null ? [] : [...state.dialogs]
        const stateMessages = [...state.messages]
        const stateIsUploaded = [...state.isUploaded]

        for (const dialog of dialogs) {
            let isPush = true

            for (const stateDialog of stateDialogs) {
                if (dialog.receiverID === stateDialog.receiverID) {
                    isPush = false
                    break
                }
            }

            if (isPush) {
                stateDialogs.push(dialog)
                stateMessages.push({
                    receiverID: dialog.receiverID,
                    messages: null,
                })
                stateIsUploaded.push({
                    receiverID: dialog.receiverID,
                    isUploaded: null,
                })
            }
        }

        return {
            ...state,
            dialogs: stateDialogs,
            messages: stateMessages,
            isUploaded: stateIsUploaded,
        }
    }),
    on(markDialogMessagesAsRead, (state, { receiverID }) => {
        if (state.dialogs === null) return state

        const dialogsMessages = [...state.messages]
        const dialogIndex = state.messages.findIndex((dialog) => dialog.receiverID === receiverID)

        const dialogMessages = dialogsMessages[dialogIndex].messages
        if (dialogIndex > -1 && dialogMessages !== null) {
            const newDialogMessages: IMessage[] = []

            for (const message of dialogMessages) {
                newDialogMessages.push({
                    ...message,
                    isReaded: true,
                })
            }

            dialogsMessages[dialogIndex] = {
                receiverID,
                messages: newDialogMessages,
            }
        }

        return {
            ...state,
            messages: dialogsMessages,
        }
    }),
    on(updateDialogNewMessagesCount, (state, { receiverID, newMessagesCount }) => {
        if (state.dialogs === null) return state

        const dialogs = [...state.dialogs]
        const dialogIndex = state.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                newMessagesCount,
            }
        }

        return {
            ...state,
            dialogs,
        }
    }),
    on(updateDialogLastMessage, (state, { receiverID, lastMessage, createdAt }) => {
        if (state.dialogs === null) return state

        const dialogs = [...state.dialogs]
        const dialogIndex = dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                createdAt,
                lastMessage,
            }
        }

        return {
            ...state,
            dialogs,
        }
    }),
    on(addDialogMessages, (state, { receiverID, messages }) => {
        const dialogsMessages = [...state.messages]
        const index = dialogsMessages.findIndex((dialogMessages) => dialogMessages.receiverID === receiverID)

        if (index > -1) {
            if (dialogsMessages[index].messages !== null) {
                const dialogMessages = [...(dialogsMessages[index].messages as IMessage[])]

                for (const message of messages) {
                    let isPush = true

                    for (const dialogMessage of dialogMessages) {
                        if (dialogMessage.messageID === message.messageID) {
                            isPush = false
                            break
                        }
                    }

                    if (isPush) dialogMessages.push(message)
                }

                dialogsMessages[index] = {
                    receiverID,
                    messages: dialogMessages,
                }
            } else {
                dialogsMessages[index] = {
                    receiverID,
                    messages,
                }
            }
        }

        return {
            ...state,
            messages: dialogsMessages,
        }
    }),
    on(updateDialogIsUploaded, (state, { receiverID, isUploaded }) => {
        const dialogsIsUploaded = [...state.isUploaded]
        const dialogIndex = dialogsIsUploaded.findIndex(
            (dialogIsUploaded) => dialogIsUploaded.receiverID === receiverID
        )

        if (dialogIndex > -1) {
            dialogsIsUploaded[dialogIndex] = {
                receiverID,
                isUploaded,
            }
        }

        return {
            ...state,
            isUploaded: dialogsIsUploaded,
        }
    }),
    on(updateDialogConnectionStatus, (state, { receiverID, connectionStatus }) => {
        if (state.dialogs === null) return state

        const dialogs = [...state.dialogs]
        const dialogIndex = dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                connectionStatus,
            }
        }

        return {
            ...state,
            dialogs
        }
    })
)
