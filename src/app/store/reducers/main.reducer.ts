import { createReducer, on } from '@ngrx/store'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'
import {
    addDialogMessages,
    addDialogs,
    decreaseDialogNewMessagesCount,
    increaseDialogNewMessagesCount,
    markDialogMessageAsRead,
    markDialogMessagesAsRead,
    removeDarkTheme,
    toggleDarkTheme,
    updateActiveReceiverID,
    updateDialogConnectionStatus,
    updateDialogLastMessage,
    updateDialogMessages,
    updateDialogNewMessagesCount,
    updateReconnectionLoading,
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
            }
        }

        return {
            ...state,
            dialogs: stateDialogs,
            messages: stateMessages,
        }
    }),
    on(markDialogMessagesAsRead, (state, { receiverID }) => {
        if (state.dialogs === null) return state

        const dialogsMessages = [...state.messages]
        const dialogIndex = state.messages.findIndex((dialog) => dialog.receiverID === receiverID)

        const dialogMessages = dialogsMessages[dialogIndex]?.messages
        if (dialogIndex > -1 && dialogMessages) {
            const newDialogMessages = dialogMessages.slice()

            for (const [i, message] of dialogMessages.entries()) {
                if (message.receiverID === receiverID) {
                    newDialogMessages[i] = {
                        ...dialogMessages[i],
                        isReaded: true,
                    }
                }
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
    on(markDialogMessageAsRead, (state, { receiverID, messageID }) => {
        const dialogsMessages = [...state.messages]

        const dialogIndex = state.messages.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            const dialogMessages = dialogsMessages[dialogIndex].messages

            if (dialogMessages !== null) {
                const newDialogMessages = dialogMessages.slice()

                for (const [i, { messageID: dialogMessageID }] of dialogMessages.entries()) {
                    if (dialogMessageID === messageID) {
                        newDialogMessages[i] = {
                            ...newDialogMessages[i],
                            isReaded: true,
                        }
                        break
                    }
                }

                dialogsMessages[dialogIndex] = {
                    ...dialogsMessages[dialogIndex],
                    messages: newDialogMessages,
                }
            }

            return {
                ...state,
                messages: dialogsMessages,
            }
        }

        return state
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
    on(increaseDialogNewMessagesCount, (state, { receiverID }) => {
        if (state.dialogs === null) return state

        const dialogs = [...state.dialogs]
        const dialogIndex = state.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            const newMessagesCount = dialogs[dialogIndex].newMessagesCount + 1

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
    on(decreaseDialogNewMessagesCount, (state, { receiverID }) => {
        if (state.dialogs === null) return state

        const dialogs = [...state.dialogs]
        const dialogIndex = state.dialogs.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            const newMessagesCount =
                dialogs[dialogIndex].newMessagesCount - 1 < 0 ? 0 : dialogs[dialogIndex].newMessagesCount - 1

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
            dialogs,
        }
    }),
    on(updateReconnectionLoading, (state, { reconnectionLoading }) => {
        return {
            ...state,
            reconnectionLoading,
        }
    }),
    on(updateDialogMessages, (state, { receiverID, messages }) => {
        const dialogsMessages = [...state.messages]

        const dialogIndex = dialogsMessages.findIndex((dialog) => dialog.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogsMessages[dialogIndex] = {
                receiverID,
                messages,
            }
        } else {
            dialogsMessages.push({
                receiverID,
                messages,
            })
        }

        return {
            ...state,
            messages: dialogsMessages,
        }
    }),
    on(toggleDarkTheme, (state) => {
        return {
            ...state,
            isDarkTheme: !state.isDarkTheme,
        }
    }),
    on(removeDarkTheme, (state) => {
        return {
            ...state,
            isDarkTheme: false,
        }
    })
)
