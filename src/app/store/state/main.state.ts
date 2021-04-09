import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'

export const mainKey = 'main'

export interface MainState {
    activeReceiverID: number | null,
    requestLoading: boolean,
    reconnectionLoading: boolean,
    dialogs: IDialog[] | null,
    messages: {
        receiverID: number,
        messages: IMessage[] | null,
    }[],
    isUploaded: {
        receiverID: number,
        isUploaded: boolean | null,
    }[]
}

export const mainInitialState: MainState = {
    activeReceiverID: null,
    requestLoading: false,
    reconnectionLoading: false,
    dialogs: null,
    messages: [],
    isUploaded: [],
}
