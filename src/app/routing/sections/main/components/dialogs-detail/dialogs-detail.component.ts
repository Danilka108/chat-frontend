import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { combineLatest, forkJoin, Observable, of, Subject, Subscription } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { addDialogMessages } from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import { getUserID } from 'src/app/store/selectors/auth.selectors'
import {
    getActiveReceiverID,
    getDialogMessages,
    getDialogs,
} from 'src/app/store/selectors/main.selectors'
import { IAppState } from 'src/app/store/states/app.state'
import { IMessageWithIsLast } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { MessageService } from '../../services/message.service'

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
})
export class DialogsDetailComponent implements OnInit, OnDestroy {
    messages$!: Observable<IMessageWithIsLast[]>
    isSelectedReceiver$ = of(true)

    take = 30
    skip = 0

    sub = new Subscription()

    sendMessageEvent = new Subject<void>()

    constructor(
        private readonly httpService: MainSectionHttpService,
        private readonly messageService: MessageService,
        private readonly store: Store<IAppState>
    ) {}

    ngOnInit() {
        this.isSelectedReceiver$ = combineLatest([
            this.store.select(getDialogs()),
            this.store.select(getActiveReceiverID()),
        ]).pipe(
            map(([dialogs, activeReceiverID]) => {
                if (activeReceiverID === null) return false

                const index = dialogs.findIndex((dialog) => {
                    return dialog.receiverID === activeReceiverID
                })

                return index > -1
            })
        )
        
        this.messages$ = this.store.select(getActiveReceiverID()).pipe(
            switchMap((activeReceiverID) => {
                if (activeReceiverID === null) return of(null)

                return this.store.select(getDialogMessages(activeReceiverID))
            }),
            map((dialogMessages) => {
                if (dialogMessages === null) return []

                return this.messageService.parseMessages(dialogMessages.messages)
            }),
        )

        this.sub.add(this.store.select(getActiveReceiverID()).pipe(
            switchMap((activeReceiverID) => {
                if (activeReceiverID) {
                    const dialogMessages = this.store.selectSnapshot(getDialogMessages(activeReceiverID))

                    if (dialogMessages) {
                        return of(null)
                    }

                    return forkJoin({
                        activeReceiverID: of(activeReceiverID),
                        messages: this.httpService.getMessages(activeReceiverID, this.take, this.skip)
                    })
                }

                return of(null)
            })
        ).subscribe((result) => {
            if (result) {
                this.store.dispatch(addDialogMessages(result.activeReceiverID, result.messages))
            }
        }))
    }

    onSendMessage() {
        this.sendMessageEvent.next()
    }

    getUserID() {
        return this.store.selectSnapshot(getUserID())
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }
}