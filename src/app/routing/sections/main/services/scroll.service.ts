import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable()
export class ScrollService {
    private readonly scrollBottom = new Subject<'updateContent' | 'updateScroll'>()
    private readonly isViewedScrollBottom = new BehaviorSubject<boolean>(false)
    private readonly sideReached = new Subject<'top' | 'bottom'>()
    private allowScrollBottom: null | boolean = null

    emitAllowScrollBottom(allowScrollBottom: boolean) {
        this.allowScrollBottom = allowScrollBottom
    }

    getAllowScrollBottom() {
        return this.allowScrollBottom
    }

    emitSideReached(side: 'top' | 'bottom') {
        this.sideReached.next(side)
    }

    getSideReached() {
        return this.sideReached.asObservable()
    }

    emitScrollBottom(step: 'updateContent' | 'updateScroll') {
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
