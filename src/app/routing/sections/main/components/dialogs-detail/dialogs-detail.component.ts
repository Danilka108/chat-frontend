import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, BehaviorSubject, forkJoin, merge, Observable, of, Subscription } from 'rxjs'
import { filter, first, map, observeOn, switchMap, tap } from 'rxjs/operators'
import { addDialogMessages, updateDialogIsUploaded } from 'src/app/store/actions/main.actions'
import { selectUserID, selectUserName } from 'src/app/store/selectors/auth.selectors'
import {
    selectActiveReceiverID,
    selectDialog,
    selectDialogIsUploaded,
    selectDialogMessages,
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

const TAKE_MESSAGES_FACTOR = 1 / 20

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
})
export class DialogsDetailComponent implements OnInit, AfterViewChecked, OnDestroy {
    @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>

    messages = new BehaviorSubject<IMessageWithIsLast[]>([])
    messages$ = this.messages.asObservable()

    take = 0
    skip = 0
    ignoreUploadNewMesssages = false

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

        if (storeMessages !== null && this.skip < storeMessages.length) {
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
            this.scrollService.getSideReached(),
            this.scrollService.getScrollBottom(),
            this.scrollService.getNewMessage().pipe(filter((type) => type === NEW_MESSAGE_START)),
            this.scrollService.getAllMessagesRead(),
            of<typeof SIDE_REACHED_TOP>(SIDE_REACHED_TOP)
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
                if (event === SIDE_REACHED_TOP) {
                    return this.onTopReached(receiverID, storeMessages, isUploaded)
                }

                if (event === SIDE_REACED_BOTTOM) {
                    return this.onBottomReached(storeMessages, outputMessages)
                }

                if (event === SCROLL_BOTTOM_UPDATE_CONTENT) {
                    return this.onScrollBottom(receiverID, storeMessages).pipe(
                        tap(() => {
                            this.scrollService.emitScrollBottom(SCROLL_BOTTOM_UPDATE_SCROLL)
                        })
                    )
                }

                if (event === NEW_MESSAGE_START) {
                    if (this.skip - this.messages.getValue().length === 0) {
                        return this.onScrollBottom(receiverID, storeMessages)
                    } else {
                        this.skip += 1
                        return this.messages$.pipe(first())
                    }
                }

                if (event === ALL_MESSAGES_READ) {
                    this.skip -= this.messages.getValue().length

                    return this.onTopReached(receiverID, storeMessages, isUploaded)
                }

                return of([])
            })
        )
    }

    ngAfterViewChecked() {
        const wrapperWidth = this.wrapper.nativeElement.clientWidth

        if (wrapperWidth > this.wrapperWidth && this.isInitWrapperWidth) {
            this.wrapperWidth = wrapperWidth
            this.changeDetectorRef.detectChanges()
        } else {
            this.isInitWrapperWidth = false
        }
    }

    ngOnInit() {
        this.take = Math.floor(document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR)

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((receiverID) => {
                    this.skip = 0
                    this.ignoreUploadNewMesssages = false
                    this.isInitWrapperWidth = true
                    return this.updateMessages(receiverID)
                }),
                tap((messages) => {
                    this.messages.next(messages)
                })
            )
            .subscribe()

        this.sub = this.messages$
            .pipe(
                tap(() => {}),
                observeOn(asyncScheduler),
                tap(() => {
                    this.scrollService.emitNewMessage(NEW_MESSAGE_END)

                    if (this.skip > this.take * 2) {
                        this.scrollService.updateAllowScrollBottom(true)
                    } else {
                        this.scrollService.updateAllowScrollBottom(false)
                    }
                })
            )
            .subscribe()
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.take = Math.floor(document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR)
        this.wrapperWidth = this.wrapper.nativeElement.offsetWidth
    }

    getUserID() {
        return this.store.select(selectUserID)
    }

    getSenderName(senderID: number) {
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

    messageIdentify(_: any, item: IMessage) {
        return item.messageID
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
