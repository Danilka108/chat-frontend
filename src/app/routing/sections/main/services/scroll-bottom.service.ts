import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable()
export class ScrollBottomService {
    private readonly scrollBottom = new Subject<{
        isUpdatingHeight: boolean
    }>()
    private readonly isViewed = new BehaviorSubject<boolean>(false)

    emitScrollBottom(isUpdatingHeight = true) {
        this.scrollBottom.next({
            isUpdatingHeight,
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
