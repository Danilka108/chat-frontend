import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IDialogMessages } from '../interfaces/dialog-messages.interface'
import { IDialogScroll } from '../interfaces/dialog-scroll.interface'

export interface IMainState {
    activeReceiverID: number | null
    dialogs: IDialog[]
    dialogsMessages: IDialogMessages[]
    dialogsScroll: IDialogScroll[]
    requestLoading: boolean
}

export const mainInitialState: IMainState = {
    activeReceiverID: null,
    dialogs: [],
    dialogsMessages: [],
    dialogsScroll: [],
    requestLoading: false,
}
