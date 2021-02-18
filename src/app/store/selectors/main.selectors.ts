import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import {
    ISelect,
    ISelectAndParse,
    STORE_I_SELECT_AND_PARSE_DISCRIMINATOR,
    STORE_I_SELECT_DISCRIMINATOR,
} from '../core/interfaces/select.interface'
import { IDialogIsUpload } from '../interfaces/dialog-is-upload.interface'
import { IDialogMessages } from '../interfaces/dialog-messages.interface'
import { IDialogScroll } from '../interfaces/dialog-scroll.interface'
import { IDialogSkip } from '../interfaces/dialog-skip.interface'
import { IAppState } from '../states/app.state'

export const getActiveReceiverID = (): ISelect<IAppState, number | null> => {
    return {
        discriminator: STORE_I_SELECT_DISCRIMINATOR,
        selectorFn: (state) => state.main.activeReceiverID,
    }
}

export const getDialogs = (): ISelect<IAppState, IDialog[]> => {
    return {
        discriminator: STORE_I_SELECT_DISCRIMINATOR,
        selectorFn: (state) => state.main.dialogs,
    }
}

export const getDialog = (receiverID: number): ISelectAndParse<IAppState, IDialog[], IDialog | null> => {
    return {
        discriminator: STORE_I_SELECT_AND_PARSE_DISCRIMINATOR,
        selectorFn: (state) => state.main.dialogs,
        parserFn: (dialogs) => {
            const dialog = dialogs.find((dlg) => dlg.receiverID === receiverID)

            return dialog ? dialog : null
        },
    }
}

export const getDialogMessages = (
    receiverID: number
): ISelectAndParse<IAppState, IDialogMessages[], IDialogMessages | null> => {
    return {
        discriminator: STORE_I_SELECT_AND_PARSE_DISCRIMINATOR,
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
        discriminator: STORE_I_SELECT_DISCRIMINATOR,
        selectorFn: (state) => state.main.requestLoading,
    }
}

export const getDialogScroll = (receiverID: number): ISelectAndParse<IAppState, IDialogScroll[], number | null> => {
    return {
        discriminator: STORE_I_SELECT_AND_PARSE_DISCRIMINATOR,
        selectorFn: (state) => state.main.dialogsScroll,
        parserFn: (dialogsScroll) => {
            const dialogScroll = dialogsScroll.find((dlgScrl) => dlgScrl.receiverID === receiverID)

            if (dialogScroll) return dialogScroll.scroll
            return null
        },
    }
}

export const getDialogSkip = (receiverID: number): ISelectAndParse<IAppState, IDialogSkip[], number | null> => {
    return {
        discriminator: STORE_I_SELECT_AND_PARSE_DISCRIMINATOR,
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
): ISelectAndParse<IAppState, IDialogIsUpload[], IDialogIsUpload | null> => {
    return {
        discriminator: STORE_I_SELECT_AND_PARSE_DISCRIMINATOR,
        selectorFn: (state) => state.main.dialogsIsUpload,
        parserFn: (dialogsIsUpload) => {
            const dialogIsUpload = dialogsIsUpload.find((dlgIsUpload) => dlgIsUpload.receiverID === receiverID)

            if (dialogIsUpload) return dialogIsUpload
            return null
        },
    }
}
