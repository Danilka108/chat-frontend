import { ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { forkJoin, Observable, of, Subscription } from 'rxjs'
import { filter, first, map, switchMap, tap } from 'rxjs/operators'
import {
    addDialogMessages,
    updateDialogIsUploaded,
    updateDialogNewMessagesCount,
    updateDialogSkip,
} from 'src/app/store/actions/main.actions'
import { selectUserID } from 'src/app/store/selectors/auth.selectors'
import {
    selectActiveReceiverID,
    selectDialog,
    selectDialogMessages,
    selectDialogSkip,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { IMessageWithIsLast } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { MessageService } from '../../services/message.service'

const TAKE_MESSAGES_FACTOR = 1 / 10

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsDetailComponent implements OnInit, OnDestroy {
    @Input() topReachedEvent!: Observable<void>

    messages$!: Observable<IMessageWithIsLast[]>
    isSelectedReceiver$ = of(true)

    take = 0

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly httpService: MainSectionHttpService,
        private readonly messageService: MessageService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit() {
        this.onWindowResize()

        this.sub = this.topReachedEvent.pipe(tap(() => this.onTopReached())).subscribe()

        this.isSelectedReceiver$ = this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((activeReceiverID) => {
                if (activeReceiverID === null) return of(null)
                return this.store.select(selectDialog, { receiverID: activeReceiverID })
            }),
            map((dialog) => {
                return !!dialog
            })
        )

        this.messages$ = this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((activeReceiverID) => {
                if (activeReceiverID === null) return of(null)
                return this.store.select(selectDialogMessages, { receiverID: activeReceiverID })
            }),
            map((dialogMessages) => {
                if (dialogMessages === null) return []
                return this.messageService.parseMessages(dialogMessages.slice())
            })
        )

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((activeReceiverID) => {
                    if (activeReceiverID === null) {
                        return of(false)
                    }

                    return this.store.pipe(
                        select(selectDialogMessages, { receiverID: activeReceiverID }),
                        first(),
                        map((messages) => {
                            return messages === null
                        })
                    )
                }),
                filter((isGetMsgs) => isGetMsgs),
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                switchMap((activeReceiverID) => {
                    if (activeReceiverID !== null) {
                        return forkJoin({
                            activeReceiverID: of(activeReceiverID),
                            messages: this.httpService.getMessages(activeReceiverID, this.take, 0),
                        })
                    }

                    return of(null)
                }),
                map((result) => {
                    if (result) {
                        const { activeReceiverID, messages } = result
                        this.store.dispatch(
                            addDialogMessages({
                                receiverID: activeReceiverID,
                                messages,
                            })
                        )
                        this.store.dispatch(
                            updateDialogSkip({
                                receiverID: activeReceiverID,
                                skip: this.take,
                            })
                        )
                        this.store.dispatch(
                            updateDialogIsUploaded({
                                receiverID: activeReceiverID,
                                isUploaded: false,
                            })
                        )
                        this.store.dispatch(
                            updateDialogNewMessagesCount({
                                receiverID: activeReceiverID,
                                newMessagesCount: 0,
                            })
                        )
                    }
                })
            )
            .subscribe()
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.take = document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR
    }

    onTopReached() {
        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                first(),
                switchMap((activeReceiverID) => {
                    if (activeReceiverID === null) {
                        return forkJoin({
                            activeReceiverID: of(null),
                            dialogSkip: of(null),
                        })
                    }

                    return forkJoin({
                        activeReceiverID: of(activeReceiverID),
                        dialogSkip: this.store.pipe(
                            select(selectDialogSkip, { receiverID: activeReceiverID }),
                            first()
                        ),
                    })
                }),
                switchMap(({ activeReceiverID, dialogSkip }) => {
                    if (activeReceiverID !== null && dialogSkip !== null) {
                        return forkJoin({
                            activeReceiverID: of(activeReceiverID),
                            dialogSkip: of(dialogSkip),
                            messages: this.httpService.getMessages(activeReceiverID, this.take, dialogSkip),
                        })
                    }

                    return of(null)
                }),
                tap((result) => {
                    if (result) {
                        const { messages, activeReceiverID, dialogSkip } = result

                        if (messages.length === 0) {
                            this.store.dispatch(
                                updateDialogIsUploaded({
                                    receiverID: activeReceiverID,
                                    isUploaded: true,
                                })
                            )
                            // this.store.dispatch(updateDialogIsUpload(activeReceiverID, false))
                        } else {
                            this.store.dispatch(
                                addDialogMessages({
                                    receiverID: activeReceiverID,
                                    messages,
                                })
                            )

                            this.store.dispatch(
                                updateDialogSkip({
                                    receiverID: activeReceiverID,
                                    skip: dialogSkip + this.take,
                                })
                            )

                            // this.store.dispatch(addDialogMessages(activeReceiverID, messages))
                            // this.store.dispatch(updateDialogSkip(activeReceiverID, dialogSkip + this.take))
                        }
                    }
                })
            )
            .subscribe()
        // const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

        // if (activeReceiverID !== null) {
        //     const dialogSkip = this.store.selectSnapshot(getDialogSkip(activeReceiverID))

        //     if (dialogSkip !== null) {
        //         this.sub = this.httpService.getMessages(activeReceiverID, this.take, dialogSkip).subscribe((messages) => {
        //             if (messages.length === 0) {
        //                 this.store.dispatch(updateDialogIsUpload(activeReceiverID, false))
        //             } else {
        //                 this.store.dispatch(addDialogMessages(activeReceiverID, messages))
        //                 this.store.dispatch(updateDialogSkip(activeReceiverID, dialogSkip + this.take))
        //             }
        //         })
        //     }
        // }
    }

    getUserID() {
        return this.store.select(selectUserID)
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
