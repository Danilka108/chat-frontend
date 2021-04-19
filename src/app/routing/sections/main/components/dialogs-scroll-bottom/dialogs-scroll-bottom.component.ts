import { AfterViewInit, Component, OnDestroy } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, Subject, Subscription } from 'rxjs'
import { first, observeOn, switchMap, tap } from 'rxjs/operators'
import { selectReconnectionLoading } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { ScrollService, SCROLL_BOTTOM_UPDATE_CONTENT } from '../../services/scroll.service'

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

    constructor(private readonly scrollService: ScrollService, private readonly store: Store<AppState>) {}

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
                switchMap(() => this.store.pipe(select(selectReconnectionLoading), first())),
                observeOn(asyncScheduler),
                tap((reconnectionLoading) => {
                    if (!reconnectionLoading) {
                        this.scrollService.emitScrollBottom(SCROLL_BOTTOM_UPDATE_CONTENT)
                        this.isDisabled = true
                        this.isViewed = false
                    }
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
