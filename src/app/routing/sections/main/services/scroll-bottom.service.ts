import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable()
export class ScrollBottomService {
    private readonly scrollBottom = new Subject<{
        isSmooth: boolean
    }>()
    private readonly isViewed = new BehaviorSubject<boolean>(false)

    emitScrollBottom(isSmooth: boolean = true) {
        this.scrollBottom.next({
            isSmooth,
        })
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
