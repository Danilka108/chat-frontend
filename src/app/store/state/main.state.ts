import { IDialog } from 'src/app/routing/sections/main/interface/dialog.interface'
import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'

export const mainKey = 'main'

// export type StoreDialog = {
//     receiverID: number
//     receiverName: string
//     lastMessage: string
//     createdAt: string
//     newMessagesCount: number
//     messages: IMessage[] | null
//     scroll: number | null
//     skip: number | null
//     isUploaded: boolean | null
// }

// export type MainState = {
//     activeReceiverID: number | null
//     requestLoading: boolean
//     // dialogs: StoreDialog[] | null
// }

// export const mainInitialState: MainState = {
//     activeReceiverID: null,
//     requestLoading: false,
//     // dialogs: null,
// }

export interface MainState {
    activeReceiverID: number | null
    requestLoading: boolean
    dialogs: IDialog[] | null
    messages: {
        receiverID: number
        messages: IMessage[] | null
    }[]
    scroll: {
        receiverID: number
        scroll: number | null
    }[]
    skip: {
        receiverID: number
        skip: number | null
    }[]
    isUploaded: {
        receiverID: number
        isUploaded: boolean | null
    }[]
}

export const mainInitialState: MainState = {
    activeReceiverID: null,
    requestLoading: false,
    dialogs: null,
    messages: [],
    scroll: [],
    skip: [],
    isUploaded: [],
}
