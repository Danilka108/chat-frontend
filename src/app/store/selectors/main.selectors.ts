import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { ISelect, ISelectAndParse } from '../core/interfaces/select.interface'
import { IDialogIsUpload } from '../interfaces/dialog-is-upload.interface'
import { IDialogMessages } from '../interfaces/dialog-messages.interface'
import { IDialogScroll } from '../interfaces/dialog-scroll.interface'
import { IDialogSkip } from '../interfaces/dialog-skip.interface'
import { IAppState } from '../states/app.state'

export const getActiveReceiverID = (): ISelect<IAppState, number | null> => {
    return {
        selectorFn: (state) => state.main.activeReceiverID,
    }
}

export const getDialogs = (): ISelect<IAppState, IDialog[]> => {
    return {
        selectorFn: (state) => state.main.dialogs,
    }
}

export const getDialog = (receiverID: number): ISelect<IAppState, IDialog[], IDialog | null> => {
    return {
        selectorFn: (state) => state.main.dialogs,
        parserFn: (dialogs) => {
            const dialog = dialogs.find((dlg) => dlg.receiverID === receiverID)

            return dialog ? dialog : null
        },
    }
}

export const getDialogMessages = (
    receiverID: number
): ISelect<IAppState, IDialogMessages[], IDialogMessages | null> => {
    return {
        selectorFn: (state) => state.main.dialogsMessages,
        parserFn: (dialogsMessages) => {
            const dialogMessages = dialogsMessages.find((dlgMsg) => dlgMsg.receiverID === receiverID)

            if (dialogMessages) return dialogMessages
            return null
        },
    }
}

export const getRequestLoading = (): ISelect<IAppState, boolean> => {
    return {
        selectorFn: (state) => state.main.requestLoading,
    }
}

export const getDialogScroll = (receiverID: number): ISelect<IAppState, IDialogScroll[], number | null> => {
    return {
        selectorFn: (state) => state.main.dialogsScroll,
        parserFn: (dialogsScroll) => {
            const dialogScroll = dialogsScroll.find((dlgScrl) => dlgScrl.receiverID === receiverID)

            if (dialogScroll) return dialogScroll.scroll
            return null
        },
    }
}

export const getDialogSkip = (receiverID: number): ISelect<IAppState, IDialogSkip[], number | null> => {
    return {
        selectorFn: (state) => state.main.dialogsSkip,
        parserFn: (dialogsSkip) => {
            const dialogSkip = dialogsSkip.find((dlgSkp) => dlgSkp.receiverID === receiverID)

            if (dialogSkip) return dialogSkip.skip
            return null
        },
    }
}

export const getDialogIsUpload = (
    receiverID: number
): ISelect<IAppState, IDialogIsUpload[], IDialogIsUpload | null> => {
    return {
        selectorFn: (state) => state.main.dialogsIsUpload,
        parserFn: (dialogsIsUpload) => {
            const dialogIsUpload = dialogsIsUpload.find((dlgIsUpload) => dlgIsUpload.receiverID === receiverID)

            if (dialogIsUpload) return dialogIsUpload
            return null
        },
    }
}
