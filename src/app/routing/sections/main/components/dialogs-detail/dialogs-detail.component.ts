import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, BehaviorSubject, forkJoin, merge, Observable, of, Subscription } from 'rxjs'
import { filter, first, map, observeOn, switchMap, tap } from 'rxjs/operators'
import {
    addDialogMessages,
    updateDialogIsUploaded,
    updateDialogMessages,
    updateDialogNewMessagesCount
} from 'src/app/store/actions/main.actions'
import { selectUserID, selectUserName } from 'src/app/store/selectors/auth.selectors'
import {
    selectActiveReceiverID,
    selectDialog,
    selectDialogIsUploaded,
    selectDialogMessages,
    selectReconnectionLoading,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { IMessage, IMessageWithIsLast } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { MessageService } from '../../services/message.service'
import {
    ALL_MESSAGES_READ,
    NEW_MESSAGE_END,
    NEW_MESSAGE_START,
    ScrollService,
    SCROLL_BOTTOM_UPDATE_CONTENT,
    SCROLL_BOTTOM_UPDATE_SCROLL,
    SIDE_REACED_BOTTOM,
    SIDE_REACHED_TOP,
} from '../../services/scroll.service'

const TAKE_MESSAGES_FACTOR = 1 / 10

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
})
export class DialogsDetailComponent implements OnInit, AfterViewChecked, OnDestroy {
    @ViewChild('wrapper', { read: ElementRef }) wrapper!: ElementRef<HTMLElement>
    @ViewChildren('anchor') anchorsRef!: QueryList<ElementRef<HTMLElement>>

    messages = new BehaviorSubject<IMessageWithIsLast[]>([])
    messages$ = this.messages.asObservable()

    take = 0

    reverseSkip = 0
    deltaSkip = 0
    relativeSkip = 0

    isRemoveInvisibleMessages = false

    ignoreUploadNewMessagesPrev = false
    ignoreUploadNewMessagesNext = false

    wrapperWidth = 0
    isInitWrapperWidth = true

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly httpService: MainSectionHttpService,
        private readonly messageService: MessageService,
        private readonly scrollService: ScrollService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    get absoluteSkip(): number {
        return this.relativeSkip + this.deltaSkip
    }

    getNextMessages(
        receiverID: number | null,
        storeMessages: IMessage[] | null,
    ): Observable<IMessageWithIsLast[]> {
        if (receiverID === null) return of([])
        
        if (storeMessages !== null && this.reverseSkip < storeMessages.length) {
            let start, end: number
            const parsedMessages = this.messageService.parseMessages(storeMessages)

            if (this.relativeSkip - this.messages.getValue().length - this.take <= 0) {
                start = 0
                end = this.take * 2 > storeMessages.length ? storeMessages.length : this.take * 2
            } else {
                const bottomSkip = this.relativeSkip - this.messages.getValue().length

                start = bottomSkip - this.take < 0 ? 0 : bottomSkip - this.take
                end = bottomSkip + this.take > storeMessages.length ? storeMessages.length : bottomSkip + this.take
            }

            const filteredMessages = parsedMessages.slice(start, end).reverse()

            if (filteredMessages.length !== 0) {
                this.reverseSkip = storeMessages.length - start
                this.relativeSkip = end

                if (this.isRemoveInvisibleMessages) {
                    this.deltaSkip = this.deltaSkip - this.take < 0 ? 0 : this.deltaSkip - this.take
                }

                return of(filteredMessages)
            }
        }

        return this.uploadNewMessages(receiverID, 'next')
    }

    getPrevMessages(
        receiverID: number | null,
        storeMessages: IMessage[] | null,
        isUploaded: boolean | null
    ): Observable<IMessageWithIsLast[]> {
        if (receiverID === null) return of([])

        if (storeMessages !== null && this.relativeSkip < storeMessages.length) {
            let start, end: number
            const parsedMessages = this.messageService.parseMessages(storeMessages)

            if (this.absoluteSkip === 0) {
                start = 0
                end = this.absoluteSkip + this.take * 2 > storeMessages.length ? storeMessages.length : this.take * 2
            } else if (this.absoluteSkip + this.take > storeMessages.length) {
                start = storeMessages.length - this.take * 2 < 0 ? 0 : storeMessages.length - this.take * 2
                end = storeMessages.length
            } else {
                start = this.absoluteSkip - this.take < 0 ? 0 : this.absoluteSkip - this.take
                end = this.absoluteSkip + this.take
            }

            const filteredMessages = parsedMessages.slice(start, end)

            if (filteredMessages.length !== 0) {
                this.reverseSkip = storeMessages.length - start
                this.relativeSkip = end

                if (this.isRemoveInvisibleMessages) {
                    this.deltaSkip = this.deltaSkip + this.take > this.absoluteSkip ? this.absoluteSkip : this.deltaSkip + this.take
                }

                return of(filteredMessages.reverse())
            }
        }

        if (isUploaded) {
            if (storeMessages) return this.messages$.pipe(first())
            else return of([])
        }

        return this.uploadNewMessages(receiverID, 'prev')
    }

    getLatestMessages(receiverID: number | null, storeMessages: IMessage[] | null): Observable<IMessageWithIsLast[]> {
        if (receiverID === null) return of([])

        if (storeMessages !== null) {
            const parsedMessages = this.messageService.parseMessages(storeMessages)

            const end = this.take * 2 > storeMessages.length ? storeMessages.length : this.take * 2

            const filteredMessages = parsedMessages.slice(0, end).reverse()

            this.reverseSkip = storeMessages.length
            this.relativeSkip = end

            return of(filteredMessages)
        }

        return this.messages$.pipe(first())
    }

    updateCurrentMessages(receiverID: number | null, storeMessages: IMessage[] | null): Observable<IMessageWithIsLast[]> {
        if (receiverID === null) return of([])

        if (storeMessages === null) return of([])

        const parsedMessages = this.messageService.parseMessages(storeMessages)

        const outputMessagesLength = this.messages.getValue().length

        const filteredMessages = parsedMessages.slice(this.absoluteSkip - outputMessagesLength, this.absoluteSkip)

        return of(filteredMessages.reverse())
    }

    removeInvisibleMessages(receiverID: number, storeMessages: IMessage[]): void {
        const outputMessages = this.messages.getValue()

        const filteredStoreMessages: IMessage[] = []

        for (const storeMessage of storeMessages) {
            for (const outputMessage of outputMessages) {
                if (storeMessage.messageID === outputMessage.messageID) {
                    filteredStoreMessages.push(storeMessage)
                }
            }
        }

        this.store.dispatch(updateDialogIsUploaded({ receiverID, isUploaded: false }))
        this.store.dispatch(updateDialogMessages({ receiverID, messages: filteredStoreMessages }))

        this.deltaSkip = this.absoluteSkip - filteredStoreMessages.length
        this.reverseSkip = filteredStoreMessages.length
        this.relativeSkip = filteredStoreMessages.length

        this.ignoreUploadNewMessagesNext = false
        this.ignoreUploadNewMessagesPrev = false
    }

    uploadNewMessages(receiverID: number, type: 'next' | 'prev'): Observable<IMessageWithIsLast[]> {
        let take = 0
        let skip = 0

        if (type === 'next') {
            take = this.take
            skip = this.absoluteSkip - this.messages.getValue().length - this.take
        } else if (type === 'prev') {
            take = this.absoluteSkip === 0 ? this.take * 2 : this.take
            skip = this.absoluteSkip
        }

        if (this.ignoreUploadNewMessagesPrev || this.ignoreUploadNewMessagesNext) return this.handleEvents(receiverID, type)

        return this.httpService.getMessages(receiverID, take, skip).pipe(
            switchMap((newMessages) => {
                if (newMessages.length === 0) {
                    if (type === 'prev') this.ignoreUploadNewMessagesPrev = true
                    if (type === 'next') this.ignoreUploadNewMessagesNext = true

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

                return this.handleEvents(receiverID, type)
            })
        )
    }

    handleEvents(receiverID: number | null, startWith: 'prev' | 'next'): Observable<IMessageWithIsLast[]> {
        return merge(
            this.scrollService.getSideReached(),
            this.scrollService.getScrollBottom(),
            this.scrollService.getNewMessage().pipe(filter((type) => type === NEW_MESSAGE_START)),
            this.scrollService.getAllMessagesRead(),
            of<typeof SIDE_REACHED_TOP | typeof SIDE_REACED_BOTTOM | null>(
                startWith === 'prev'
                    ? SIDE_REACHED_TOP
                    : startWith === 'next'
                        ? SIDE_REACED_BOTTOM
                        : null
            )
        ).pipe(
            switchMap((event) => {
                if (receiverID === null)
                    return forkJoin({
                        storeMessages: of(null),
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
                    isUploaded: this.store.pipe(select(selectDialogIsUploaded, { receiverID }), first()),
                    event: of(event),
                })
            }),
            switchMap(({ storeMessages, isUploaded, event }) => {
                if (event === SIDE_REACHED_TOP) {
                    return this.getPrevMessages(receiverID, storeMessages, isUploaded)
                }

                if (event === SIDE_REACED_BOTTOM && this.absoluteSkip - this.messages.getValue().length !== 0) {
                    return this.getNextMessages(receiverID, storeMessages)
                }

                if (event === SCROLL_BOTTOM_UPDATE_CONTENT) {
                    return this.getLatestMessages(receiverID, storeMessages).pipe(
                        tap(() => {
                            this.scrollService.emitScrollBottom(SCROLL_BOTTOM_UPDATE_SCROLL)
                        })
                    )
                }

                if (event === NEW_MESSAGE_START) {
                    if (this.absoluteSkip - this.messages.getValue().length === 0) {
                        return this.getLatestMessages(receiverID, storeMessages)
                    } else {
                        this.relativeSkip += 1
                    }
                }

                if (event === ALL_MESSAGES_READ) {
                    return this.updateCurrentMessages(receiverID, storeMessages)
                }

                return this.messages$.pipe(first())
            })
        )
    }

    ngAfterViewChecked(): void {
        const wrapperWidth = this.wrapper.nativeElement.clientWidth

        if (wrapperWidth > this.wrapperWidth && this.isInitWrapperWidth) {
            this.wrapperWidth = wrapperWidth
            this.changeDetectorRef.detectChanges()
        } else {
            this.isInitWrapperWidth = false
        }
    }

    ngOnInit(): void {
        this.take = Math.floor(document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR)

        this.sub = this.store.pipe(
            select(selectReconnectionLoading),
            filter(() => !this.isRemoveInvisibleMessages),
            switchMap((reconnectionLoading) => forkJoin({
                reconnectionLoading: of(reconnectionLoading),
                activeReceiverID: this.store.pipe(select(selectActiveReceiverID), first()),
            })),
            switchMap(({ reconnectionLoading, activeReceiverID }) => forkJoin({
                reconnectionLoading: of(reconnectionLoading),
                activeReceiverID: of(activeReceiverID),
                storeMessages: activeReceiverID === null
                    ? of(null)
                    : this.store.pipe(select(selectDialogMessages, { receiverID: activeReceiverID }), first())
            })),
            tap(({ reconnectionLoading, activeReceiverID, storeMessages }) => {
                if (reconnectionLoading && activeReceiverID !== null && storeMessages ) {
                    this.isRemoveInvisibleMessages = true
                    this.removeInvisibleMessages(activeReceiverID, storeMessages)
                }
            })
        ).subscribe()

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((receiverID) => {
                    this.deltaSkip = 0
                    this.reverseSkip = 0
                    this.relativeSkip = 0
                    this.ignoreUploadNewMessagesPrev = false
                    this.ignoreUploadNewMessagesNext = false
                    this.isInitWrapperWidth = true
                    this.isRemoveInvisibleMessages = false

                    if (receiverID !== null) this.store.dispatch(updateDialogNewMessagesCount({ receiverID, newMessagesCount: 0 }))

                    return this.handleEvents(receiverID, 'prev')
                }),
                tap((messages) => {
                    this.messages.next(messages)
                })
            )
            .subscribe()

        this.sub = this.messages$
            .pipe(
                observeOn(asyncScheduler),
                tap(() => {
                    setTimeout(() => {
                        this.scrollService.updateTopAnchor(this.anchorsRef.first)
                        this.scrollService.updateBottomAnchor(this.anchorsRef.last)

                        this.scrollService.emitDiscardUpdatingContent()
                    })
                    this.scrollService.emitNewMessage(NEW_MESSAGE_END)

                    if (this.absoluteSkip > this.take * 2) {
                        this.scrollService.updateAllowScrollBottom(true)
                    } else {
                        this.scrollService.updateAllowScrollBottom(false)
                    }
                })
            )
            .subscribe()
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.take = Math.floor(document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR)
        this.wrapperWidth = this.wrapper.nativeElement.offsetWidth
    }

    getUserID(): Observable<number | null> {
        return this.store.select(selectUserID)
    }

    getSenderName(senderID: number): Observable<string> {
        return this.store.pipe(
            select(selectUserID),
            first(),
            switchMap((userID) => {
                if (userID === senderID) return this.store.pipe(
                    select(selectUserName),
                    first()
                )

                return this.store.pipe(
                    select(selectDialog, { receiverID: senderID }),
                    first(),
                    map((dialog) => dialog === null ? '' : dialog.receiverName)
                )
            })
        )
    }

    messageIdentify(_: unknown, item: IMessage): number {
        return item.messageID
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
