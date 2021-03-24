import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

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
    private readonly allMessagesRead = new Subject<typeof ALL_MESSAGES_READ>()
    private allowScrollBottom: null | boolean = null

    emitAllMessagesRead() {
        this.allMessagesRead.next(ALL_MESSAGES_READ)
    }

    getAllMessagesRead() {
        return this.allMessagesRead.asObservable()
    }

    emitNewMessage(type: typeof NEW_MESSAGE_START | typeof NEW_MESSAGE_END) {
        this.newMessage.next(type)
    }

    getNewMessage() {
        return this.newMessage.asObservable()
    }

    updateAllowScrollBottom(allowScrollBottom: boolean) {
        this.allowScrollBottom = allowScrollBottom
    }

    getAllowScrollBottom() {
        return this.allowScrollBottom
    }

    emitSideReached(side: typeof SIDE_REACHED_TOP | typeof SIDE_REACED_BOTTOM) {
        this.sideReached.next(side)
    }

    getSideReached() {
        return this.sideReached.asObservable()
    }

    emitScrollBottom(step: typeof SCROLL_BOTTOM_UPDATE_SCROLL | typeof SCROLL_BOTTOM_UPDATE_CONTENT) {
        this.scrollBottom.next(step)
    }

    getScrollBottom() {
        return this.scrollBottom.asObservable()
    }

    emitIsViewedScrollBottom(isViewed: boolean) {
        this.isViewedScrollBottom.next(isViewed)
    }

    getIsViewedScrollBottom() {
        return this.isViewedScrollBottom.asObservable()
    }
}