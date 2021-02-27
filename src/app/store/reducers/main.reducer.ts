import { createReducer, on } from '@ngrx/store'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'
import {
    addDialogMessages,
    addDialogs,
    updateActiveReceiverID,
    updateDialogIsUploaded,
    updateDialogLastMessage,
    updateDialogNewMessagesCount,
    updateDialogScroll,
    updateDialogSkip,
    updateRequestLoading,
} from '../actions/main.actions'
import { mainInitialState } from '../state/main.state'

export const mainReducer = createReducer(
    mainInitialState,
    on(updateActiveReceiverID, (state, { activeReceiverID }) => ({
        ...state,
        activeReceiverID,
    })),
    on(addDialogs, (state, { dialogs }) => {
        const dlgs = [...state.dialogs]

        for (const dialog of dialogs) {
            const dialogIndex = state.dialogs.findIndex((dlg) => dlg.receiverID === dialog.receiverID)

            if (dialogIndex === -1) {
                dlgs.push({
                    ...dialog,
                    messages: null,
                    scroll: null,
                    skip: null,
                    isUploaded: false,
                })
            }
        }

        return {
            ...state,
            dialogs: dlgs,
        }
    }),
    on(updateDialogLastMessage, (state, { receiverID, lastMessage }) => {
        const dialogs = [...state.dialogs]

        const dialogIndex = dialogs.findIndex((dlg) => dlg.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                lastMessage,
            }
        }

        return {
            ...state,
            dialogs,
        }
    }),
    on(updateDialogNewMessagesCount, (state, { receiverID, newMessagesCount }) => {
        const dialogs = [...state.dialogs]

        const dialogIndex = dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

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
    on(addDialogMessages, (state, { receiverID, messages }) => {
        const dialogs = [...state.dialogs]

        const dialogIndex = dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1 && dialogs[dialogIndex].messages !== null) {
            const dialogMessages = dialogs[dialogIndex].messages as IMessage[]
            const newMessages: IMessage[] = []

            for (const message of messages) {
                let isAdd = true

                for (const dialogMessage of dialogMessages) {
                    if (dialogMessage.messageID === message.messageID) {
                        isAdd = false
                        break
                    }
                }

                if (isAdd) {
                    newMessages.push(message)
                }
            }

            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                messages: dialogMessages.concat(newMessages),
            }
        } else if (dialogs[dialogIndex].messages === null) {
            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                messages,
            }
        }

        return {
            ...state,
            dialogs,
        }
    }),
    on(updateDialogScroll, (state, { receiverID, scroll }) => {
        const dialogs = [...state.dialogs]

        const dialogIndex = dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                scroll,
            }
        }

        return {
            ...state,
            dialogs,
        }
    }),
    on(updateDialogSkip, (state, { receiverID, skip }) => {
        const dialogs = [...state.dialogs]

        const dialogIndex = dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                skip,
            }
        }

        return {
            ...state,
            dialogs,
        }
    }),
    on(updateDialogIsUploaded, (state, { receiverID, isUploaded }) => {
        const dialogs = [...state.dialogs]

        const dialogIndex = dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogs[dialogIndex] = {
                ...dialogs[dialogIndex],
                isUploaded,
            }
        }

        return {
            ...state,
            dialogs,
        }
    }),
    on(updateRequestLoading, (state, { requestLoading }) => {
        return {
            ...state,
            requestLoading,
        }
    })
)
