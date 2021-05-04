import { Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { selectUserID } from 'src/app/store/selectors/auth.selectors'
import { AppState } from 'src/app/store/state/app.state'
import {
    IMessage,
    IMessagesSectionBySender,
    IMessagesSection,
    IMessagesSectionByDate,
} from '../interface/message.interface'

@Injectable()
export class MessageService {
    constructor(private readonly dateService: DateService, private readonly store: Store<AppState>) {}

    parseMessages(messages: IMessage[]): IMessage[] {
        return messages.sort((a, b) => this.dateService.compareDatesASC(a.createdAt, b.createdAt)).reverse()
    }

    private splitMessagesBySender(messages: IMessage[], userID: number): IMessagesSectionBySender[] {
        const sectionsBySender: IMessagesSectionBySender[] = []

        if (!messages.length) return []

        sectionsBySender.push({
            messages: [messages[0]],
            isOwnMessages: messages[0].senderID === userID,
            id: messages[0].messageID,
        })

        for (let i = 0; i < messages.length - 1; i++) {
            const currMessage = messages[i]
            const nextMessage = messages[i + 1]

            if (currMessage.senderID !== nextMessage.senderID) {
                sectionsBySender.push({
                    messages: [nextMessage],
                    isOwnMessages: nextMessage.senderID === userID,
                    id: nextMessage.messageID,
                })

                continue
            }

            const lastSectionBySender = sectionsBySender[sectionsBySender.length - 1]

            sectionsBySender[sectionsBySender.length - 1] = {
                ...lastSectionBySender,
                id: nextMessage.messageID,
                messages: [...lastSectionBySender.messages, nextMessage],
            }
        }

        return sectionsBySender
    }

    splitMessages(messages: IMessage[]): Observable<IMessagesSection[]> {
        return this.store.pipe(
            select(selectUserID),
            map((userID) => {
                const sectionsByDate: IMessagesSectionByDate[] = []

                if (!messages.length || userID === null) return []

                sectionsByDate.push({
                    messages: [messages[0]],
                    date: messages[0].createdAt,
                    id: this.dateService.getIDFromDate(messages[0].createdAt),
                })

                for (let i = 0; i < messages.length - 1; i++) {
                    const currMessage = messages[i]
                    const nextMessage = messages[i + 1]

                    const isUnequalDays = this.dateService.isUnequalDays(currMessage.createdAt, nextMessage.createdAt)
                    if (isUnequalDays) {
                        sectionsByDate.push({
                            messages: [nextMessage],
                            date: nextMessage.createdAt,
                            id: this.dateService.getIDFromDate(nextMessage.createdAt),
                        })

                        continue
                    }

                    const lastSectionByDate = sectionsByDate[sectionsByDate.length - 1]

                    sectionsByDate[sectionsByDate.length - 1] = {
                        messages: [...lastSectionByDate.messages, nextMessage],
                        date: nextMessage.createdAt,
                        id: this.dateService.getIDFromDate(nextMessage.createdAt),
                    }
                }

                const sections: IMessagesSection[] = []

                for (let i = 0; i < sectionsByDate.length; i++) {
                    sections.push({
                        date: sectionsByDate[i].date,
                        sectionsBySender: this.splitMessagesBySender(sectionsByDate[i].messages, userID),
                        id: sectionsByDate[i].id,
                    })
                }

                return sections
            })
        )
    }
}
