import { Component, OnInit } from '@angular/core'
import { combineLatest, forkJoin, Observable, of, Subscription } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { AuthStore } from 'src/app/store/auth/auth.store'
import { MainStore } from 'src/app/store/main/main.store'
import { IMessage } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../main-section-http.service'

interface IMessageWithIsLast extends IMessage {
    isLastInGroup: boolean
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

    constructor(
        private readonly mainStore: MainStore,
        private readonly httpService: MainSectionHttpService,
        private readonly dateService: DateService,
        private readonly authStore: AuthStore
    ) {}

    ngOnInit() {
        this.isSelectedReceiver$ = combineLatest([
            this.mainStore.getDialogs$(),
            this.mainStore.getActiveReceiverID$(),
        ]).pipe(
            map(([dialogs, activeReceiverID]) => {
                if (activeReceiverID === null) return false

                const index = dialogs.findIndex((dialog) => {
                    return dialog.receiverID === activeReceiverID
                })

                return index > -1
            })
        )

        const msgs$ = this.mainStore.getActiveReceiverID$().pipe(
            map((activeReceiverID) => {
                if (!activeReceiverID) throw null
                return {
                    activeReceiverID,
                    dialogMessages: this.mainStore.getDialogMessages(activeReceiverID),
                }
            }),
            switchMap(({ activeReceiverID, dialogMessages }) => {
                let messages$: Observable<IMessage[]>

                if (dialogMessages === null) {
                    messages$ = this.httpService.getMessages(activeReceiverID, 10, 0).pipe(
                        tap((messages) => {
                            messages.forEach((message) => {
                                this.mainStore.addDialogMessage(activeReceiverID, message)
                            })
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
                return this.mainStore.getDialogMessages$(activeReceiverID)
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

    parseMessages(messages: IMessage[]): IMessageWithIsLast[] {
        return messages
            .sort((a, b) => this.dateService.compareDatesASC(a.createdAt, b.createdAt))
            .map((message, i, arr) => {
                if (message.senderID !== arr[i + 1]?.senderID) {
                    const msg: IMessageWithIsLast = {
                        ...message,
                        isLastInGroup: true,
                    }
                    return msg
                } else {
                    const msg: IMessageWithIsLast = {
                        ...message,
                        isLastInGroup: false,
                    }
                    return msg
                }
            })
    }

    getUserID() {
        return this.authStore.getUserID()
    }
}
