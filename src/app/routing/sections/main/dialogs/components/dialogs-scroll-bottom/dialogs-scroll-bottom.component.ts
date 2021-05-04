import { AfterViewInit, Component, OnDestroy } from '@angular/core'
import { asyncScheduler, Subject, Subscription } from 'rxjs'
import { observeOn, tap } from 'rxjs/operators'
import { SCROLL_BOTTOM_UPDATE_CONTENT } from '../../dialogs.constants'
import { ScrollService } from '../../services/scroll.service'

@Component({
    selector: 'app-dialogs-scroll-bottom',
    templateUrl: './dialogs-scroll-bottom.component.html',
    styleUrls: ['./dialogs-scroll-bottom.component.scss'],
})
export class DialogsScrollBottomComponent implements AfterViewInit, OnDestroy {
    isViewed = false
    isDisabled = false
    subscription = new Subscription()

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    click = new Subject<void>()
    click$ = this.click.asObservable()

    constructor(private readonly scrollService: ScrollService) {}

    ngAfterViewInit(): void {
        this.sub = this.scrollService
            .getIsViewedScrollBottom()
            .pipe(
                tap((isViewed) =>
                    setTimeout(() => {
                        this.isViewed = isViewed
                        this.isDisabled = !isViewed
                    })
                )
            )
            .subscribe()

        this.sub = this.click$
            .pipe(
                observeOn(asyncScheduler),
                tap(() => {
                    this.scrollService.emitScrollBottom(SCROLL_BOTTOM_UPDATE_CONTENT)
                    this.isDisabled = true
                    this.isViewed = false
                })
            )
            .subscribe()
    }

    onClick(): void {
        this.click.next()
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
