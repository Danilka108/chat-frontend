import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { updateDialogMessages } from 'src/app/store/actions/main.actions'
import { AppState } from 'src/app/store/state/app.state'
import {
    MESSAGES_READ,
    NEW_MESSAGE,
    SCROLL_BOTTOM_UPDATE_CONTENT,
    SCROLL_BOTTOM_UPDATE_SCROLL,
    SIDE_REACED_BOTTOM,
    SIDE_REACHED_TOP,
} from '../dialogs.constants'

@Injectable()
export class ScrollService {
    private readonly scrollBottom = new Subject<
        typeof SCROLL_BOTTOM_UPDATE_SCROLL | typeof SCROLL_BOTTOM_UPDATE_CONTENT
    >()
    private readonly isViewedScrollBottom = new BehaviorSubject<boolean>(false)
    private readonly sideReached = new Subject<typeof SIDE_REACHED_TOP | typeof SIDE_REACED_BOTTOM>()
    private readonly newMessage = new Subject<typeof NEW_MESSAGE>()
    private readonly messagesRead = new Subject<typeof MESSAGES_READ>()
    private readonly scrolled = new Subject<void>()
    private readonly discardUpdatingContent = new Subject<void>()
    private readonly topAnchorMessageID = new Subject<number>()

    private allowScrollBottom: null | boolean = null
    private clearPrevDialogReceiverID: number | null = null
    private topAnchor: HTMLElement | null = null

    constructor(private readonly store: Store<AppState>) {}

    updateTopAnchor(elementRef: HTMLElement): void {
        this.topAnchor = elementRef
    }

    getTopAnchor(): HTMLElement | null {
        return this.topAnchor
    }

    emitTopAchorMessageID(messageID: number): void {
        this.topAnchorMessageID.next(messageID)
    }

    getTopAnchorMessageID(): Observable<number> {
        return this.topAnchorMessageID.asObservable()
    }

    updatePrevDialog(receiverID: number): void {
        this.clearPrevDialogReceiverID = receiverID
    }

    clearPrevDialog(): void {
        if (this.clearPrevDialogReceiverID !== null) {
            this.store.dispatch(
                updateDialogMessages({
                    receiverID: this.clearPrevDialogReceiverID,
                    messages: null,
                })
            )
        }

        this.clearPrevDialogReceiverID = null
    }

    emitDiscardUpdatingContent(): void {
        this.discardUpdatingContent.next()
    }

    getDiscardUpdatingContent(): Observable<void> {
        return this.discardUpdatingContent.asObservable()
    }

    emitScrolled(): void {
        this.scrolled.next()
    }

    getScrolled(): Observable<void> {
        return this.scrolled.asObservable()
    }

    emitMessagesRead(): void {
        this.messagesRead.next(MESSAGES_READ)
    }

    getMessagesRead(): Observable<typeof MESSAGES_READ> {
        return this.messagesRead.asObservable()
    }

    emitNewMessage(): void {
        this.newMessage.next(NEW_MESSAGE)
    }

    getNewMessage(): Observable<typeof NEW_MESSAGE> {
        return this.newMessage.asObservable()
    }

    updateAllowScrollBottom(allowScrollBottom: boolean): void {
        this.allowScrollBottom = allowScrollBottom
    }

    getAllowScrollBottom(): boolean | null {
        return this.allowScrollBottom
    }

    emitSideReached(side: typeof SIDE_REACHED_TOP | typeof SIDE_REACED_BOTTOM): void {
        this.sideReached.next(side)
    }

    getSideReached(): Observable<typeof SIDE_REACED_BOTTOM | typeof SIDE_REACHED_TOP> {
        return this.sideReached.asObservable()
    }

    emitScrollBottom(step: typeof SCROLL_BOTTOM_UPDATE_SCROLL | typeof SCROLL_BOTTOM_UPDATE_CONTENT): void {
        this.scrollBottom.next(step)
    }

    getScrollBottom(): Observable<typeof SCROLL_BOTTOM_UPDATE_CONTENT | typeof SCROLL_BOTTOM_UPDATE_SCROLL> {
        return this.scrollBottom.asObservable()
    }

    emitIsViewedScrollBottom(isViewed: boolean): void {
        this.isViewedScrollBottom.next(isViewed)
    }

    getIsViewedScrollBottom(): Observable<boolean> {
        return this.isViewedScrollBottom.asObservable()
    }
}
