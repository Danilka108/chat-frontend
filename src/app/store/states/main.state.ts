import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IDialogMessages } from '../interfaces/dialogs-messages.interface'

export interface IMainState {
    activeReceiverID: number | null
    dialogs: IDialog[]
    dialogsMessages: IDialogMessages[]
    requestLoading: boolean
}

export const mainInitialState: IMainState = {
    activeReceiverID: null,
    dialogs: [],
    dialogsMessages: [],
    requestLoading: false,
}
