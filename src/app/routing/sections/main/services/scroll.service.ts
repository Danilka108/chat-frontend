import { ElementRef, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { updateDialogMessages } from 'src/app/store/actions/main.actions'
import { AppState } from 'src/app/store/state/app.state'

export const SCROLL_BOTTOM_UPDATE_SCROLL = 'SCROLL_BOTTOM_UPDATE_SCROLL'
export const SCROLL_BOTTOM_UPDATE_CONTENT = 'SCROLL_BOTTOM_UPDATE_CONTENT'
export const SIDE_REACHED_TOP = 'SIDE_REACHED_TOP'
export const SIDE_REACED_BOTTOM = 'SIDE_REACED_BOTTOM'
export const NEW_MESSAGE_START = 'NEW_MESSAGE_START'
export const NEW_MESSAGE_END = 'NEW_MESSAGE_END'
export const ALL_MESSAGES_READ = 'ALL_MESSAGES_READ'

@Injectable()
export class ScrollService {
    private readonly scrollBottom = new Subject<
        typeof SCROLL_BOTTOM_UPDATE_SCROLL | typeof SCROLL_BOTTOM_UPDATE_CONTENT
    >()
    private readonly isViewedScrollBottom = new BehaviorSubject<boolean>(false)
    private readonly sideReached = new Subject<typeof SIDE_REACHED_TOP | typeof SIDE_REACED_BOTTOM>()
    private readonly newMessage = new Subject<typeof NEW_MESSAGE_START | typeof NEW_MESSAGE_END>()
    private readonly messagesRead = new Subject<typeof ALL_MESSAGES_READ>()
    private allowScrollBottom: null | boolean = null
    private readonly scrolled = new Subject<void>()
    private topAnchor: ElementRef<HTMLElement> | null = null
    private bottomAnchor: ElementRef<HTMLElement> | null = null
    private readonly discardUpdatingContent = new Subject<void>()
    private clearPrevDialogReceiverID: number | null = null

    constructor(private readonly store: Store<AppState>) {}

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

    updateTopAnchor(elementRef: ElementRef<HTMLElement>): void {
        this.topAnchor = elementRef
    }

    getTopAnchor(): ElementRef<HTMLElement> | null {
        return this.topAnchor
    }

    updateBottomAnchor(elementRef: ElementRef<HTMLElement>): void {
        this.bottomAnchor = elementRef
    }

    getBottomAnchor(): ElementRef<HTMLElement> | null {
        return this.bottomAnchor
    }

    emitScrolled(): void {
        this.scrolled.next()
    }

    getScrolled(): Observable<void> {
        return this.scrolled.asObservable()
    }

    emitMessagesRead(): void {
        this.messagesRead.next(ALL_MESSAGES_READ)
    }

    getMessagesRead(): Observable<typeof ALL_MESSAGES_READ> {
        return this.messagesRead.asObservable()
    }

    emitNewMessage(type: typeof NEW_MESSAGE_START | typeof NEW_MESSAGE_END): void {
        this.newMessage.next(type)
    }

    getNewMessage(): Observable<typeof NEW_MESSAGE_END | typeof NEW_MESSAGE_START> {
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
