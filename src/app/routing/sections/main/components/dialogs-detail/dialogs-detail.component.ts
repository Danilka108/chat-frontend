import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { forkJoin, Observable, of, Subject, Subscription } from 'rxjs'
import { filter, first, map, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import {
    addDialogMessages,
    updateDialogIsUploaded,
    updateDialogLastMessage,
    updateDialogNewMessagesCount,
    updateDialogSkip,
} from 'src/app/store/actions/main.actions'
import { selectUserID } from 'src/app/store/selectors/auth.selectors'
import {
    selectActiveReceiverID,
    selectDialog,
    selectDialogMessages,
    selectDialogNewMessagesCount,
    selectDialogSkip,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { WsEvents } from 'src/app/ws/ws.events'
import { WsService } from 'src/app/ws/ws.service'
import { IMessage, IMessageWithIsLast } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { MessageService } from '../../services/message.service'

const TAKE_MESSAGES_FACTOR = 1 / 5

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsDetailComponent implements OnInit, OnDestroy {
    isSelectedReceiver$ = of(true)

    messages$: Observable<IMessageWithIsLast[]> = of([])

    topReached = new Subject<void>()
    topReached$ = this.topReached.asObservable()

    take = 0

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly httpService: MainSectionHttpService,
        private readonly messageService: MessageService,
        private readonly wsService: WsService,
        private readonly dateService: DateService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit() {
        this.onWindowResize()

        this.isSelectedReceiver$ = this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((activeReceiverID) =>
                activeReceiverID === null ? of(null) : this.store.select(selectDialog, { receiverID: activeReceiverID })
            ),
            map((dialog) => {
                return !!dialog
            })
        )

        this.messages$ = this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((activeReceiverID) =>
                activeReceiverID === null
                    ? of(null)
                    : this.store.select(selectDialogMessages, { receiverID: activeReceiverID })
            ),
            map((dialogMessages) =>
                dialogMessages === null ? [] : this.messageService.parseMessages(dialogMessages.slice())
            )
        )

        /**
         * Initial loading of messages
         */
        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((activeReceiverID) =>
                    activeReceiverID === null
                        ? of(false)
                        : this.store.pipe(
                              select(selectDialogMessages, { receiverID: activeReceiverID }),
                              first(),
                              map((messages) => messages === null)
                          )
                ),
                filter((isGetMsgs) => isGetMsgs),
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                switchMap((activeReceiverID) =>
                    activeReceiverID === null
                        ? of(null)
                        : forkJoin({
                              activeReceiverID: of(activeReceiverID),
                              messages: this.httpService.getMessages(activeReceiverID, this.take, 0),
                          })
                ),
                tap((result) => {
                    if (!result) return

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
                })
            )
            .subscribe()

        /**
         * Getting messages across websocket
         */
        this.sub = this.wsService
            .fromEvent<IMessage>(WsEvents.user.newMessage)
            .pipe(
                switchMap((message) =>
                    forkJoin({
                        message: of(message),
                        userID: this.store.pipe(select(selectUserID), first()),
                    })
                ),
                switchMap(({ message, userID }) => {
                    const receiverID = userID === message.receiverID ? message.senderID : message.receiverID

                    return forkJoin({
                        receiverID: of(receiverID),
                        message: of(message),
                        dialogSkip: this.store.pipe(select(selectDialogSkip, { receiverID }), first()),
                        dialogNewMessagesCount: this.store.pipe(
                            select(selectDialogNewMessagesCount, { receiverID }),
                            first()
                        ),
                    })
                }),
                map(({ message, receiverID, dialogSkip, dialogNewMessagesCount }) => {
                    const dlgSkip = dialogSkip === null ? 0 : dialogSkip
                    const dlgNewMessagesCount = dialogNewMessagesCount === null ? 0 : dialogNewMessagesCount

                    this.store.dispatch(
                        addDialogMessages({
                            receiverID,
                            messages: [message],
                        })
                    )

                    this.store.dispatch(
                        updateDialogLastMessage({
                            receiverID,
                            lastMessage: message.message,
                            createdAt: this.dateService.now(),
                        })
                    )

                    this.store.dispatch(
                        updateDialogSkip({
                            receiverID,
                            skip: dlgSkip,
                        })
                    )

                    // this.store.dispatch(
                    //     updateDialogNewMessagesCount({
                    //         receiverID,
                    //         newMessagesCount: dlgNewMessagesCount + 1,
                    //     })
                    // )
                })
            )
            .subscribe()

        /**
         * Upload new messages by topReached
         */
        this.sub = this.topReached$
            .pipe(
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                switchMap((activeReceiverID) =>
                    forkJoin({
                        activeReceiverID: of(activeReceiverID),
                        dialogSkip:
                            activeReceiverID === null
                                ? of(null)
                                : this.store.pipe(select(selectDialogSkip, { receiverID: activeReceiverID }), first()),
                    })
                ),
                switchMap(({ activeReceiverID, dialogSkip }) =>
                    activeReceiverID == null || dialogSkip === null
                        ? of(null)
                        : forkJoin({
                              messages: this.httpService.getMessages(activeReceiverID, this.take, dialogSkip),
                              activeReceiverID: of(activeReceiverID),
                              dialogSkip: of(dialogSkip),
                          })
                ),
                tap((result) => {
                    if (result === null) return

                    const { messages, activeReceiverID, dialogSkip } = result

                    if (messages.length === 0) {
                        this.store.dispatch(
                            updateDialogIsUploaded({
                                receiverID: activeReceiverID,
                                isUploaded: true,
                            })
                        )

                        return
                    }

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
                })
            )
            .subscribe()
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.take = document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR
    }

    onTopReached() {
        this.topReached.next()
    }

    getUserID() {
        return this.store.select(selectUserID)
    }

    messageIdentify(_: any, item: IMessageWithIsLast) {
        return item.messageID
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
