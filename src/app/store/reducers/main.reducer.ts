import { makeStateKey } from '@angular/platform-browser'
import {
    MainActions,
    UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION,
    ADD_MAIN_DIALOGS_ACTION,
    ADD_MAIN_DIALOG_MESSAGES_ACTION,
    UPDATE_MAIN_DIALOG_SCROLL_ACTION,
    UPDATE_DIALOG_SKIP_ACTION,
} from '../actions/main.actions'
import { IReducerFn } from '../core/interfaces/reducer-fn.interface'
import { IMainState } from '../states/main.state'

export const mainReducer: IReducerFn<IMainState, MainActions> = (state, action) => {
    switch (action.type) {
        case UPDATE_MAIN_ACTIVE_RECEIVER_ID_ACTION: {
            return {
                ...state,
                activeReceiverID: action.payload,
            }
        }
        case ADD_MAIN_DIALOGS_ACTION: {
            const dialogs = [...state.dialogs]

            action.payload.forEach((dialog) => {
                const dialogIndex = dialogs.findIndex((dlg) => dlg.receiverID === dialog.receiverID)

                if (dialogIndex > -1) {
                    dialogs[dialogIndex] = dialog
                } else {
                    dialogs.push(dialog)
                }
            })

            return {
                ...state,
                dialogs,
            }
        }
        case ADD_MAIN_DIALOG_MESSAGES_ACTION: {
            const dialogsMessages = [...state.dialogsMessages]

            const dialogMessagesIndex = dialogsMessages.findIndex(
                (dialogMessages) => dialogMessages.receiverID === action.payload.receiverID
            )

            if (dialogMessagesIndex > -1) {
                action.payload.messages.forEach((message) => {
                    const messageIndex = dialogsMessages[dialogMessagesIndex].messages.findIndex(
                        (msg) => msg.messageID === message.messageID
                    )

                    if (messageIndex > -1) {
                        dialogsMessages[dialogMessagesIndex].messages[messageIndex] = message
                    } else {
                        dialogsMessages[dialogMessagesIndex].messages.push(message)
                    }
                })
            } else {
                const dialogIndex = state.dialogs.findIndex((dialog) => dialog.receiverID === action.payload.receiverID)

                if (dialogIndex > -1) {
                    dialogsMessages.push({
                        receiverID: action.payload.receiverID,
                        messages: action.payload.messages,
                    })
                }
            }

            return {
                ...state,
                dialogsMessages,
            }
        }
        case UPDATE_MAIN_DIALOG_SCROLL_ACTION: {
            const dialogsScroll = [...state.dialogsScroll]

            const dialogIndex = dialogsScroll.findIndex((dialogScroll) => {
                return dialogScroll.receiverID === action.payload.receiverID
            })

            if (dialogIndex > -1) {
                dialogsScroll[dialogIndex].scroll = action.payload.scroll
            } else {
                dialogsScroll.push(action.payload)
            }

            return {
                ...state,
                dialogsScroll,
            }
        }
        case UPDATE_DIALOG_SKIP_ACTION: {
            const dialogsSkip = [...state.dialogsSkip]

            const dialogIndex = dialogsSkip.findIndex(
                (dialogSkip) => dialogSkip.receiverID === action.payload.receiverID
            )

            if (dialogIndex > -1) {
                dialogsSkip[dialogIndex].skip = action.payload.skip
            } else {
                dialogsSkip.push(action.payload)
            }

            return {
                ...state,
                dialogsSkip,
            }
        }
        default:
            return state
    }
}
