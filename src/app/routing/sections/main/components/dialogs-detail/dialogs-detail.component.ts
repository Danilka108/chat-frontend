import { Component, OnInit } from '@angular/core'
import { combineLatest, forkJoin, Observable, of, Subscription } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { AuthStore } from 'src/app/store/auth/auth.store'
import { getActiveReceiverID } from 'src/app/store/main/actions/active-receiver-id.actions'
import { addDialogsMessages, getDialogMessages } from 'src/app/store/main/actions/dialogs-messages.actions'
import { getDialogs } from 'src/app/store/main/actions/dialogs.actions'
import { MainStore } from 'src/app/store/main/main.store'
import { IMessage } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../main-section-http.service'

interface IMessageWithIsLast extends IMessage {
    isLastInGroup: boolean
    isDiffDays: boolean
    diffDate: string
}

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
})
export class DialogsDetailComponent implements OnInit {
    messages$!: Observable<IMessageWithIsLast[]>
    isSelectedReceiver$ = of(true)
    subs!: Subscription
    take = 30
    skip = 0

    constructor(
        private readonly mainStore: MainStore,
        private readonly httpService: MainSectionHttpService,
        private readonly dateService: DateService,
        private readonly authStore: AuthStore
    ) {}

    ngOnInit() {
        this.isSelectedReceiver$ = combineLatest([
            this.mainStore.select(getDialogs()),
            this.mainStore.select(getActiveReceiverID()),
        ]).pipe(
            map(([dialogs, activeReceiverID]) => {
                if (activeReceiverID === null) return false

                const index = dialogs.findIndex((dialog) => {
                    return dialog.receiverID === activeReceiverID
                })

                return index > -1
            })
        )

        const msgs$ = this.mainStore.select(getActiveReceiverID()).pipe(
            map((activeReceiverID) => {
                if (!activeReceiverID) throw null
                return {
                    activeReceiverID,
                    dialogMessages: this.mainStore.selectSync(getDialogMessages(activeReceiverID)),
                }
            }),
            switchMap(({ activeReceiverID, dialogMessages }) => {
                let messages$: Observable<IMessage[]>

                if (dialogMessages === null) {
                    messages$ = this.httpService.getMessages(activeReceiverID, this.take, this.skip).pipe(
                        tap((messages) => {
                            this.mainStore.dispatch(addDialogsMessages(activeReceiverID, ...messages))
                        })
                    )
                } else {
                    messages$ = of(dialogMessages.messages)
                }

                return forkJoin({
                    activeReceiverID: of(activeReceiverID),
                    dialogMessages: messages$,
                })
            }),
            switchMap(({ activeReceiverID }) => {
                return this.mainStore.select(getDialogMessages(activeReceiverID))
            }),
            map((dialogMessages) => {
                if (dialogMessages) {
                    return this.parseMessages(dialogMessages.messages)
                } else {
                    return []
                }
            }),
            catchError(() => [])
        )

        this.messages$ = this.isSelectedReceiver$.pipe(
            switchMap((isSelected) => {
                if (isSelected) return msgs$
                return of([])
            })
        )
    }

    parseDays(message: IMessage, arr: IMessage[], i: number) {
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
                    const [isUnequalDays, diffDate] = this.parseDays(message, arr, i)

                    const msg: IMessageWithIsLast = {
                        ...message,
                        isLastInGroup: true,
                        isDiffDays: isUnequalDays,
                        diffDate: diffDate,
                    }
                    return msg
                } else {
                    const [isUnequalDays, diffDate] = this.parseDays(message, arr, i)

                    const msg: IMessageWithIsLast = {
                        ...message,
                        isLastInGroup: false,
                        isDiffDays: isUnequalDays,
                        diffDate: diffDate,
                    }
                    return msg
                }
            })
            .map((message) => {
                const msg = message

                if (msg.isDiffDays) {
                    msg.isLastInGroup = true
                }

                return msg
            })
    }

    getUserID() {
        return this.authStore.getUserID()
    }
}
