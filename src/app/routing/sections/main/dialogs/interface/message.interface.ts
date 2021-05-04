export interface IMessage {
    senderID: number
    receiverID: number
    message: string
    createdAt: string
    updatedAt: string
    isUpdated: boolean
    messageID: number
    isReaded: boolean
}

export interface IMessagesSectionBySender {
    messages: IMessage[]
    isOwnMessages: boolean
    id: number
}

export interface IMessagesSectionByDate {
    messages: IMessage[]
    date: string
    id: string
}

export interface IMessagesSection {
    sectionsBySender: IMessagesSectionBySender[]
    date: string
    id: string
}
