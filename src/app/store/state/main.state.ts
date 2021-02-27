import { IMessage } from 'src/app/routing/sections/main/interface/message.interface'

export const mainKey = 'main'

export type StoreDialog = {
    receiverID: number
    receiverName: string
    lastMessage: string
    createdAt: string
    newMessagesCount: number
    messages: IMessage[] | null
    scroll: number | null
    skip: number | null
    isUploaded: boolean | null
}

export type MainState = {
    activeReceiverID: number | null
    requestLoading: boolean
    dialogs: StoreDialog[]
}

export const mainInitialState: MainState = {
    activeReceiverID: null,
    requestLoading: false,
    dialogs: [],
}
