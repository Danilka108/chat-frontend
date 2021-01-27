import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { ISelectorFn } from '../core/interfaces/selector.interface'
import { IDialogMessages } from '../interfaces/dialogs-messages.interface'
import { IAppState } from '../states/app.state'

export const getActiveReceiverID = (): ISelectorFn<IAppState, number | null> => {
    return (state) => state.main.activeReceiverID
}

export const getDialogs = (): ISelectorFn<IAppState, IDialog[]> => {
    return (state) => state.main.dialogs
}

export const getDialogMessages = (receiverID: number): ISelectorFn<IAppState, IDialogMessages | null> => {
    return (state) => {
        const dialogMessages = state.main.dialogsMessages.find((dlgMsg) => dlgMsg.receiverID === receiverID)

        if (dialogMessages) return dialogMessages
        return null
    }
}

export const getRequestLoading = (): ISelectorFn<IAppState, boolean> => {
    return (state) => state.main.requestLoading
}
