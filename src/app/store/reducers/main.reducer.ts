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
    on(updateRequestLoading, (state, { requestLoading }) => {
        return {
            ...state,
            requestLoading,
        }
    }),
    on(addDialogs, (state, { dialogs }) => {
        const stateDialogs = state.dialogs === null ? [] : [...state.dialogs]
        const stateMessages = [...state.messages]
        const stateScroll = [...state.scroll]
        const stateSkip = [...state.skip]
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
                stateScroll.push({
                    receiverID: dialog.receiverID,
                    scroll: null,
                })
                stateSkip.push({
                    receiverID: dialog.receiverID,
                    skip: null,
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
            scroll: stateScroll,
            skip: stateSkip,
            isUploaded: stateIsUploaded,
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
    on(updateDialogScroll, (state, { receiverID, scroll }) => {
        const dialogsScroll = [...state.scroll]
        const dialogIndex = dialogsScroll.findIndex((dialogScroll) => dialogScroll.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogsScroll[dialogIndex] = {
                receiverID,
                scroll,
            }
        }

        return {
            ...state,
            scroll: dialogsScroll,
        }
    }),
    on(updateDialogSkip, (state, { receiverID, skip }) => {
        const dialogsSkip = [...state.skip]
        const dialogIndex = dialogsSkip.findIndex((dialogSkip) => dialogSkip.receiverID === receiverID)

        if (dialogIndex > -1) {
            dialogsSkip[dialogIndex] = {
                receiverID,
                skip,
            }
        }

        return {
            ...state,
            skip: dialogsSkip,
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
    })
)
