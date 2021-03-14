import { DataSource } from '@angular/cdk/collections'
import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChange,
    SimpleChanges,
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { IDatasource } from 'ngx-ui-scroll'
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable, of, pipe, Subject, Subscription } from 'rxjs'
import {
    catchError,
    combineAll,
    distinctUntilChanged,
    filter,
    first,
    map,
    skip,
    skipUntil,
    skipWhile,
    startWith,
    switchMap,
    tap,
} from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { addDialogMessages, updateDialogIsUploaded } from 'src/app/store/actions/main.actions'
import { selectUserID } from 'src/app/store/selectors/auth.selectors'
import {
    selectActiveReceiverID,
    selectDialogIsUploaded,
    selectDialogMessages,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { WsService } from 'src/app/ws/ws.service'
import { IMessage, IMessageWithIsLast } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { MessageService } from '../../services/message.service'
import { ScrollService } from '../../services/scroll.service'

const TAKE_MESSAGES_FACTOR = 1 / 15

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsDetailComponent implements OnInit, OnDestroy {
    messages = new BehaviorSubject<IMessageWithIsLast[]>([])
    messages$ = this.messages.asObservable()

    take = 0
    skip = 0
    ignoreTopReached = false

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly httpService: MainSectionHttpService,
        private readonly messageService: MessageService,
        private readonly wsService: WsService,
        private readonly dateService: DateService,
        private readonly scrollService: ScrollService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    onTopReached(
        receiverID: number | null,
        {
            messages,
            isUploaded,
        }: {
            messages: IMessage[] | null
            isUploaded: boolean | null
        }
    ): Observable<IMessageWithIsLast[]> {
        if (receiverID === null) return of([])

        if (messages !== null && this.skip < messages.length) {
            const filteredMessages: IMessage[] = []

            if (this.skip + this.take > messages.length) {
                for (let i = messages.length - this.take * 2; i < messages.length; i++) {
                    if (i >= 0) filteredMessages.push(messages[i])
                }

                if (filteredMessages.length !== 0) {
                    this.skip = messages.length
                }
            } else if (this.skip === 0) {
                for (let i = 0; i < this.take * 2 && i < messages.length; i++) {
                    filteredMessages.push(messages[i])
                }

                if (filteredMessages.length !== 0) {
                    this.skip = filteredMessages.length
                }
            } else {
                for (let i = this.skip; i < this.skip + this.take; i++) {
                    if (i >= 0) filteredMessages.push(messages[i])
                }

                const skip = this.skip

                if (filteredMessages.length !== 0) {
                    this.skip += filteredMessages.length
                }

                for (let i = skip - this.take; i < skip; i++) {
                    if (i < messages.length && i >= 0) filteredMessages.push(messages[i])
                }
            }

            if (filteredMessages.length !== 0) {
                return of(this.messageService.parseMessages(filteredMessages.reverse().slice()))
            }
        }

        if (isUploaded) {
            if (messages) return this.messages$.pipe(first())
            else return of([])
        }

        return this.httpService.getMessages(receiverID, this.skip === 0 ? this.take * 2 : this.take, this.skip).pipe(
            switchMap((newMessages) => {
                console.log(newMessages)
                if (newMessages.length === 0) {
                    this.ignoreTopReached = true
                    this.store.dispatch(
                        updateDialogIsUploaded({
                            receiverID,
                            isUploaded: true,
                        })
                    )
                } else {
                    this.store.dispatch(
                        updateDialogIsUploaded({
                            receiverID,
                            isUploaded: false,
                        })
                    )

                    this.store.dispatch(
                        addDialogMessages({
                            receiverID,
                            messages: newMessages,
                        })
                    )
                }

                return this.updateMessages(receiverID)
            })
        )
    }

    updateMessages(receiverID: number | null): Observable<IMessageWithIsLast[]> {
        return this.scrollService.getSideReached().pipe(
            startWith('top'),
            switchMap(() => {
                if (receiverID === null)
                    return forkJoin({
                        messages: of(null),
                        isUploaded: of(null),
                    })

                return forkJoin({
                    messages: this.store.pipe(
                        select(selectDialogMessages, { receiverID }),
                        first(),
                        map((messages) => {
                            if (messages === null) return null
                            return messages.concat([])
                        })
                    ),
                    isUploaded: this.store.pipe(select(selectDialogIsUploaded, { receiverID }), first()),
                })
            }),
            switchMap((result) => {
                return this.onTopReached(receiverID, result).pipe(filter(() => !this.ignoreTopReached))
            })
            // tap(console.log),
        )
    }

    ngOnInit() {
        this.onWindowResize()

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((receiverID) => {
                    this.skip = 0
                    this.ignoreTopReached = false
                    return this.updateMessages(receiverID)
                }),
                tap((messages) => {
                    this.messages.next(messages)
                })
            )
            .subscribe()

        // /**
        //  * Getting messages across websocket
        //  */
        // this.sub = this.wsService
        //     .fromEvent<IMessage>(WsEvents.user.newMessage)
        //     .pipe(
        //         switchMap((message) =>
        //             forkJoin({
        //                 message: of(message),
        //                 userID: this.store.pipe(select(selectUserID), first()),
        //             })
        //         ),
        //         switchMap(({ message, userID }) => {
        //             const receiverID = userID === message.receiverID ? message.senderID : message.receiverID

        //             return forkJoin({
        //                 receiverID: of(receiverID),
        //                 message: of(message),
        //                 dialogSkip: this.store.pipe(select(selectDialogSkip, { receiverID }), first()),
        //                 dialogNewMessagesCount: this.store.pipe(
        //                     select(selectDialogNewMessagesCount, { receiverID }),
        //                     first()
        //                 ),
        //             })
        //         }),
        //         map(({ message, receiverID, dialogSkip, dialogNewMessagesCount }) => {
        //             const dlgSkip = dialogSkip === null ? 0 : dialogSkip
        //             const dlgNewMessagesCount = dialogNewMessagesCount === null ? 0 : dialogNewMessagesCount

        //             this.store.dispatch(
        //                 addDialogMessages({
        //                     receiverID,
        //                     messages: [message],
        //                 })
        //             )

        //             this.store.dispatch(
        //                 updateDialogLastMessage({
        //                     receiverID,
        //                     lastMessage: message.message,
        //                     createdAt: this.dateService.now(),
        //                 })
        //             )

        //             this.store.dispatch(
        //                 updateDialogSkip({
        //                     receiverID,
        //                     skip: dlgSkip,
        //                 })
        //             )

        //             // this.store.dispatch(
        //             //     updateDialogNewMessagesCount({
        //             //         receiverID,
        //             //         newMessagesCount: dlgNewMessagesCount + 1,
        //             //     })
        //             // )
        //         })
        //     )
        //     .subscribe()
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.take = Math.floor(document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR)
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
