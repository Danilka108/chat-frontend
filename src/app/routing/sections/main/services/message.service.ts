import { Injectable } from '@angular/core'
import { DateService } from 'src/app/common/date.service'
import { IMessage, IMessageWithIsLast } from '../interface/message.interface'

@Injectable()
export class MessageService {
    constructor(private readonly dateService: DateService) {}

    private parseMessagesDays(message: IMessage, arr: IMessage[], i: number) {
        let isUnequalDays: boolean | null = null
        let diffDate = ''

        if (arr[i - 1]) {
            isUnequalDays = this.dateService.isUnequalDays(message.createdAt, arr[i - 1].createdAt)

            if (isUnequalDays) {
                diffDate = message.createdAt
            }
        } else {
            isUnequalDays = true
            diffDate = message.createdAt
        }

        const result: [boolean, string] = [isUnequalDays, diffDate]
        return result
    }

    parseMessages(messages: IMessage[]): IMessageWithIsLast[] {
        return messages
            .sort((a, b) => this.dateService.compareDatesASC(a.createdAt, b.createdAt))
            .map((message, i, arr) => {
                if (message.senderID !== arr[i + 1]?.senderID) {
                    const [isUnequalDays, diffDate] = this.parseMessagesDays(message, arr, i)

                    const msg: IMessageWithIsLast = {
                        ...message,
                        isLastInGroup: true,
                        isDiffDays: isUnequalDays,
                        diffDate: diffDate,
                    }
                    return msg
                } else {
                    const [isUnequalDays, diffDate] = this.parseMessagesDays(message, arr, i)

                    const msg: IMessageWithIsLast = {
                        ...message,
                        isLastInGroup: false,
                        isDiffDays: isUnequalDays,
                        diffDate: diffDate,
                    }
                    return msg
                }
            })
            .map((message, i, arr) => {
                const msg = message

                if (arr[i + 1]?.isDiffDays) {
                    msg.isLastInGroup = true
                }

                return msg
            })
    }
}
