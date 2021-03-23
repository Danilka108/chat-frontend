import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, BehaviorSubject, forkJoin, merge, Observable, of, Subscription } from 'rxjs'
import { first, map, observeOn, startWith, switchMap, tap } from 'rxjs/operators'
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
})
export class DialogsDetailComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>

    messages = new BehaviorSubject<IMessageWithIsLast[]>([])
    messages$ = this.messages.asObservable()

    take = 0
    skip = 0
    ignoreUploadNewMesssages = false

    wrapperWidth = new BehaviorSubject(0)
    wrapperWidth$ = this.wrapperWidth.asObservable()

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

    onBottomReached(
        storeMessages: IMessage[] | null,
        outputMessages: IMessage[] | null
    ): Observable<IMessageWithIsLast[]> {
        if (storeMessages !== null) {
            let start, end: number
            const parsedMessages = this.messageService.parseMessages(storeMessages)

            if (this.skip - this.take * 3 <= 0) {
                start = 0
                end = this.take * 2 > storeMessages.length ? storeMessages.length : this.take * 2
            } else {
                const bottomSkip = this.skip - (outputMessages === null ? 0 : outputMessages.length)

                start = bottomSkip - this.take < 0 ? 0 : bottomSkip - this.take
                end = bottomSkip + this.take > storeMessages.length ? storeMessages.length : bottomSkip + this.take
            }

            const filteredMessages = parsedMessages.slice(start, end).reverse()

            if (filteredMessages.length !== 0) {
                this.skip = end

                return of(filteredMessages)
            }
        }

        return this.messages$.pipe(first())
    }

    onScrollBottom(receiverID: number | null, storeMessages: IMessage[] | null): Observable<IMessageWithIsLast[]> {
        if (receiverID === null) return of([])

        if (storeMessages !== null) {
            const parsedMessages = this.messageService.parseMessages(storeMessages)

            const end = this.take * 2 > storeMessages.length ? storeMessages.length : this.take * 2

            const filteredMessages = parsedMessages.slice(0, end).reverse()

            this.skip = end

            return of(filteredMessages)
        }

        return this.messages$.pipe(first())
    }

    onTopReached(
        receiverID: number | null,
        storeMessages: IMessage[] | null,
        isUploaded: boolean | null
    ): Observable<IMessageWithIsLast[]> {
        if (receiverID === null) return of([])

        if (storeMessages !== null && this.skip < storeMessages.length - 1) {
            let start, end: number
            const parsedMessages = this.messageService.parseMessages(storeMessages)

            if (this.skip === 0) {
                start = 0

                end = this.skip + this.take * 2 > storeMessages.length ? storeMessages.length : this.take * 2
            } else if (this.skip + this.take > storeMessages.length) {
                start = storeMessages.length - this.take * 2 < 0 ? 0 : storeMessages.length - this.take * 2

                end = storeMessages.length
            } else {
                start = this.skip - this.take < 0 ? 0 : this.skip - this.take

                end = this.skip + this.take
            }

            const filteredMessages = parsedMessages.slice(start, end)

            if (filteredMessages.length !== 0) {
                this.skip = end

                return of(filteredMessages.reverse())
            }
        }

        if (isUploaded) {
            if (storeMessages) return this.messages$.pipe(first())
            else return of([])
        }

        return this.uploadNewMessages(receiverID)
    }

    uploadNewMessages(receiverID: number): Observable<IMessageWithIsLast[]> {
        if (this.ignoreUploadNewMesssages) return this.updateMessages(receiverID)

        return this.httpService.getMessages(receiverID, this.skip === 0 ? this.take * 2 : this.take, this.skip).pipe(
            switchMap((newMessages) => {
                if (newMessages.length === 0) {
                    this.ignoreUploadNewMesssages = true
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
        return merge(
            this.scrollService.getSideReached().pipe(startWith('top')),
            this.scrollService.getScrollBottom()
        ).pipe(
            switchMap((event) => {
                if (receiverID === null)
                    return forkJoin({
                        storeMessages: of(null),
                        outputMessages: of(null),
                        isUploaded: of(null),
                        event: of(null),
                    })

                return forkJoin({
                    storeMessages: this.store.pipe(
                        select(selectDialogMessages, { receiverID }),
                        first(),
                        map((messages) => {
                            if (messages === null) return null
                            return messages.concat([])
                        })
                    ),
                    outputMessages: this.messages$.pipe(first()),
                    isUploaded: this.store.pipe(select(selectDialogIsUploaded, { receiverID }), first()),
                    event: of(event),
                })
            }),
            switchMap(({ storeMessages, outputMessages, isUploaded, event }) => {
                if (event === 'top') {
                    return this.onTopReached(receiverID, storeMessages, isUploaded)
                }

                if (event === 'bottom') {
                    return this.onBottomReached(storeMessages, outputMessages)
                }

                if (event === 'updateContent') {
                    return this.onScrollBottom(receiverID, storeMessages).pipe(
                        tap(() => {
                            this.scrollService.emitScrollBottom('updateScroll')
                        })
                    )
                }

                return of([])
            })
        )
    }

    ngAfterViewInit() {
        this.onWindowResize()
    }

    ngOnInit() {
        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((receiverID) => {
                    this.skip = 0
                    this.ignoreUploadNewMesssages = false
                    return this.updateMessages(receiverID)
                }),
                tap((messages) => this.messages.next(messages))
            )
            .subscribe()

        this.sub = this.messages$.pipe(observeOn(asyncScheduler)).subscribe()

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
        this.wrapperWidth.next(this.wrapper.nativeElement.offsetWidth)
    }

    getUserID() {
        return this.store.select(selectUserID)
    }

    messageIdentify(_: any, item: IMessage) {
        return item.messageID
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
