export interface IMessage {
    senderID: number
    receiverID: number
    message: string
    createdAt: string
    updatedAt: string
    isUpdated: boolean
    messageID: number
}

export interface IMessageWithIsLast extends IMessage {
    isLastInGroup: boolean
    isDiffDays: boolean
    diffDate: string
}
