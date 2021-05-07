import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, BehaviorSubject, forkJoin, merge, Observable, of, Subscription } from 'rxjs'
import { filter, first, map, observeOn, switchMap, tap } from 'rxjs/operators'
import { addDialogMessages, updateDialogNewMessagesCount } from 'src/app/store/actions/main.actions'
import {
    selectActiveReceiverID,
    selectDialogMessages,
    selectReconnectionLoading,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import {
    MESSAGES_READ,
    NEW_MESSAGE,
    SCROLL_BOTTOM_UPDATE_CONTENT,
    SCROLL_BOTTOM_UPDATE_SCROLL,
    SIDE_REACED_BOTTOM,
    SIDE_REACHED_TOP,
    TAKE_MESSAGES_FACTOR,
} from '../../dialogs.constants'
import { IMessage, IMessagesSection } from '../../interface/message.interface'
import { HttpService } from '../../services/http.service'
import { MessageService } from '../../services/message.service'
import { ScrollService } from '../../services/scroll.service'
import { SidebarService } from '../../services/sidebar.service'

@Component({
    selector: 'app-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
})
export class DialogsDetailComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLElement>

    @HostBinding('class.sidebar-open') isOpenSidebar = false
    @HostBinding('class.sidebar-closed') isClosedSidebar = false
    @HostBinding('class.not-selected') isNotSelected = false

    isSelectedDialog$!: Observable<boolean>

    messages = new BehaviorSubject<IMessage[]>([])
    messages$ = this.messages.asObservable()

    messagesSections = new BehaviorSubject<IMessagesSection[]>([])
    messagesSections$ = this.messagesSections.asObservable()

    reverseSkip = 0
    skip = 0

    take = 0

    ignoreUploadNewMessagesTop = false
    ignoreUploadNewMessagesBottom = false

    isRemoveInvisibleMessages = false

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly scrollService: ScrollService,
        private readonly httpService: HttpService,
        private readonly messageService: MessageService,
        private readonly sidebarService: SidebarService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    getTopMessages(receiverID: number, storeMessages: IMessage[] | null): Observable<IMessage[]> {
        if (storeMessages !== null && this.skip < storeMessages.length) {
            const end =
                this.skip + this.take > storeMessages.length
                    ? storeMessages.length
                    : this.skip === 0
                    ? this.take * 2
                    : this.skip + this.take

            const parsedMessages = this.messageService.parseMessages(storeMessages.concat([])).slice(0, end).reverse()

            if (parsedMessages.length !== 0) {
                this.skip = end
                return of(parsedMessages)
            }
        }

        return this.uploadNewMessages(receiverID, 'top')
    }

    getBottomMessages(receiverID: number, storeMessages: IMessage[] | null): Observable<IMessage[]> {
        return this.messages$.pipe(first())
    }

    updateCurrentMessages(storeMessages: IMessage[] | null): Observable<IMessage[]> {
        if (storeMessages === null) return this.messages$.pipe(first())

        const end = this.skip > storeMessages.length ? storeMessages.length : this.skip

        const parsedMessages = this.messageService.parseMessages(storeMessages.concat([])).slice(0, end).reverse()

        return of(parsedMessages)
    }

    uploadNewMessages(receiverID: number, side: 'top' | 'bottom'): Observable<IMessage[]> {
        if (
            (side === 'bottom' && this.ignoreUploadNewMessagesBottom) ||
            (side === 'top' && this.ignoreUploadNewMessagesTop)
        )
            return this.messages$.pipe(first())

        let skip = 0
        const take = this.skip === 0 ? this.take * 2 : this.take

        if (side === 'top') {
            skip = this.skip
        } else if (side === 'bottom') {
            const messagesLength = this.messages.getValue().length
            skip = this.skip - messagesLength - this.take
        }

        return this.httpService.getMessages(receiverID, take, skip).pipe(
            switchMap((messages) => {
                if (messages.length === 0) {
                    if (side === 'top') this.ignoreUploadNewMessagesTop = true
                    if (side === 'bottom') this.ignoreUploadNewMessagesBottom = true
                } else {
                    this.store.dispatch(addDialogMessages({ receiverID, messages }))
                }

                return this.handleEvents(receiverID, side)
            })
        )
    }

    handleEvents(receiverID: number, startWithSide: 'top' | 'bottom' = 'top'): Observable<IMessage[]> {
        return merge(
            this.scrollService.getSideReached(),
            this.scrollService.getScrollBottom(),
            this.scrollService.getNewMessage(),
            this.scrollService.getMessagesRead(),
            of<typeof SIDE_REACHED_TOP | typeof SIDE_REACED_BOTTOM | null>(
                startWithSide === 'top' ? SIDE_REACHED_TOP : startWithSide === 'bottom' ? SIDE_REACED_BOTTOM : null
            )
        ).pipe(
            switchMap((event) =>
                forkJoin({
                    event: of(event),
                    storeMessages: this.store.pipe(select(selectDialogMessages, { receiverID }), first()),
                })
            ),
            switchMap(({ event, storeMessages }) => {
                if (event === SIDE_REACHED_TOP) return this.getTopMessages(receiverID, storeMessages)

                if (event === SIDE_REACED_BOTTOM) return this.getBottomMessages(receiverID, storeMessages)

                if (event === NEW_MESSAGE) {
                    this.skip += 1
                    return this.updateCurrentMessages(storeMessages)
                }

                if (event === MESSAGES_READ) {
                    return this.updateCurrentMessages(storeMessages)
                }

                if (event === SCROLL_BOTTOM_UPDATE_CONTENT) {
                    this.scrollService.emitScrollBottom(SCROLL_BOTTOM_UPDATE_SCROLL)
                }

                return this.messages$.pipe(first())
            })
        )
    }

    ngAfterViewInit(): void {
        this.scrollService.updateViewport(this.wrapperRef.nativeElement)
    }

    ngOnInit(): void {
        this.isSelectedDialog$ = this.store.pipe(
            select(selectActiveReceiverID),
            map((receiverID) => receiverID !== null)
        )

        this.sub = this.sidebarService
            .getIsOpenSidebar()
            .pipe(
                tap((isOpenSidebar) => {
                    this.isClosedSidebar = !isOpenSidebar
                    this.isOpenSidebar = isOpenSidebar
                })
            )
            .subscribe()

        this.onWindowResize()

        this.sub = this.store
            .pipe(
                select(selectReconnectionLoading),
                filter(() => !this.isRemoveInvisibleMessages),
                switchMap((reconnectionLoading) =>
                    forkJoin({
                        reconnectionLoading: of(reconnectionLoading),
                        activeReceiverID: this.store.pipe(select(selectActiveReceiverID), first()),
                    })
                ),
                switchMap(({ reconnectionLoading, activeReceiverID }) =>
                    forkJoin({
                        reconnectionLoading: of(reconnectionLoading),
                        activeReceiverID: of(activeReceiverID),
                        storeMessages:
                            activeReceiverID === null
                                ? of(null)
                                : this.store.pipe(
                                      select(selectDialogMessages, { receiverID: activeReceiverID }),
                                      first()
                                  ),
                    })
                ),
                tap(({ reconnectionLoading, activeReceiverID, storeMessages }) => {
                    if (reconnectionLoading && activeReceiverID !== null && storeMessages) {
                        this.isRemoveInvisibleMessages = true
                        this.ignoreUploadNewMessagesBottom = false
                        this.ignoreUploadNewMessagesTop = false
                    }
                })
            )
            .subscribe()

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                tap((receiverID) => {
                    if (receiverID !== null) {
                        this.store.dispatch(updateDialogNewMessagesCount({ receiverID, newMessagesCount: 0 }))
                    }

                    this.isNotSelected = receiverID === null

                    this.skip = 0
                    this.reverseSkip = 0
                    this.ignoreUploadNewMessagesTop = false
                    this.ignoreUploadNewMessagesBottom = false
                }),
                switchMap((receiverID) => {
                    return receiverID === null ? this.messages$.pipe(first()) : this.handleEvents(receiverID)
                }),
                switchMap((messages) => {
                    this.messages.next(messages)

                    return this.messageService.splitMessages(messages)
                }),
                tap((messagesSections) => {
                    this.messagesSections.next(messagesSections)
                }),
                observeOn(asyncScheduler),
                tap(() => {
                    this.scrollService.emitScrolled()

                    if (this.skip > this.take) {
                        this.scrollService.updateAllowScrollBottom(true)
                    } else {
                        this.scrollService.updateAllowScrollBottom(false)
                    }

                    setTimeout(() => {
                        const messages = this.messages.getValue()
                        if (messages.length) {
                            this.scrollService.emitTopAchorMessageID(messages[0].messageID)
                        }

                        this.scrollService.emitDiscardUpdatingContent()
                    })
                })
            )
            .subscribe()
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.take = Math.floor(document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR)
    }

    sectionIdentify(_: number, item: IMessagesSection): string {
        return item.id
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
