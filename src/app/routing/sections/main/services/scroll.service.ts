import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable()
export class ScrollService {
    private readonly scrollBottom = new Subject<void>()
    private readonly isViewed = new BehaviorSubject<boolean>(false)
    private readonly sideReached = new Subject<'top' | 'bottom'>()

    emitSideReached(side: 'top' | 'bottom') {
        this.sideReached.next(side)
    }

    getSideReached() {
        return this.sideReached.asObservable()
    }

    emitScrollBottom() {
        this.scrollBottom.next()
    }

    getScrollBottom() {
        return this.scrollBottom.asObservable()
    }

    emitIsViewed(isViewed: boolean) {
        this.isViewed.next(isViewed)
    }

    getIsViewed() {
        return this.isViewed.asObservable()
    }
}
