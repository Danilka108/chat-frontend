import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IDialogIsUpload } from '../interfaces/dialog-is-upload.interface'
import { IDialogMessages } from '../interfaces/dialog-messages.interface'
import { IDialogScroll } from '../interfaces/dialog-scroll.interface'
import { IDialogSkip } from '../interfaces/dialog-skip.interface'

export interface IMainState {
    activeReceiverID: number | null
    dialogs: IDialog[]
    dialogsMessages: IDialogMessages[]
    dialogsScroll: IDialogScroll[]
    requestLoading: boolean
    dialogsSkip: IDialogSkip[]
    dialogsIsUpload: IDialogIsUpload[]
}

export const mainInitialState: IMainState = {
    activeReceiverID: null,
    dialogs: [],
    dialogsMessages: [],
    dialogsScroll: [],
    requestLoading: false,
    dialogsSkip: [],
    dialogsIsUpload: [],
}
