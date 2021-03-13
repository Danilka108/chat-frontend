import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable()
export class ScrollService {
    private readonly scrollBottom = new Subject<void>()
    private readonly isViewed = new BehaviorSubject<boolean>(false)
    private readonly topReached = new Subject<void>()

    emitTopReached() {
        this.topReached.next()
    }

    getTopReached() {
        return this.topReached.asObservable()
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
