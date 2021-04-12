export interface IDialog {
    receiverID: number
    receiverName: string
    lastMessage: string
    createdAt: string
    newMessagesCount: number
    connectionStatus: 'offline' | 'online'
}
