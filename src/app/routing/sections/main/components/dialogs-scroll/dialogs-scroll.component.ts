import { ScrollDispatcher } from '@angular/cdk/scrolling'
import { AfterViewChecked, Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, BehaviorSubject, combineLatest, of, Subscription } from 'rxjs'
import { filter, observeOn, switchMap, tap } from 'rxjs/operators'
import { selectActiveReceiverID } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { ScrollService } from '../../services/scroll.service'

const SCROLLBAR_UPDATE_DISTANCE_FACTOR = 0.3
const SCROLLBAR_DISTANCE_DELTA = 5

@Component({
    selector: 'app-main-dialogs-scroll',
    templateUrl: './dialogs-scroll.component.html',
    styleUrls: ['./dialogs-scroll.component.scss'],
})
export class DialogsScrollComponent implements OnInit, AfterViewChecked, OnDestroy {
    height = new BehaviorSubject(0)
    height$ = this.height.asObservable()

    scroll = new BehaviorSubject<null | number>(null)
    scroll$ = this.scroll.asObservable()

    isEmitTopReachedEvent = false
    isEmitBottomReachedEvent = false

    topReachedDistance: null | number = 300
    bottomReachedDistance: null | number = null

    isTopUpdatingContent = false
    isBottomUpdatingContent = false

    isScrollDown = false

    ignoreScroll = false

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly scrollService: ScrollService,
        private readonly scrollDispatcher: ScrollDispatcher,
        private readonly ngZone: NgZone
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    @HostListener('mousewheel', ['$event'])
    onMousewheel(event: WheelEvent) {
        if (!event.ctrlKey && this.isScrollDown) {
            event.preventDefault()
        }
    }

    @HostListener('touchmove', ['$event'])
    onMousemove(event: TouchEvent) {
        if (this.isScrollDown) {
            event.preventDefault()
        }
    }

    ngOnInit() {
        const viewport = document.documentElement

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                tap(() => {
                    this.isEmitBottomReachedEvent = false
                    this.isTopUpdatingContent = false
                    this.isBottomUpdatingContent = false
                    this.isScrollDown = false
                    this.scroll.next(null)
                })
            )
            .subscribe()

        this.sub = this.scrollService
            .getScrollBottom()
            .pipe(
                filter((step) => step === 'updateScroll'),
                observeOn(asyncScheduler),
                tap(() => {
                    this.isScrollDown = true

                    this.topReachedDistance =
                        (viewport.scrollHeight - viewport.clientHeight) * SCROLLBAR_UPDATE_DISTANCE_FACTOR
                    this.bottomReachedDistance =
                        (viewport.scrollHeight - viewport.clientHeight) * (1 - SCROLLBAR_UPDATE_DISTANCE_FACTOR)

                    viewport.scrollTo({
                        top: this.height.getValue(),
                        behavior: 'smooth',
                    })
                })
            )
            .subscribe()

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap(() => this.height$),
                tap((height) => {
                    if (this.isTopUpdatingContent) {
                        this.bottomReachedDistance = viewport.scrollTop + SCROLLBAR_DISTANCE_DELTA
                        this.topReachedDistance =
                            (viewport.scrollHeight - viewport.clientHeight) * SCROLLBAR_UPDATE_DISTANCE_FACTOR
                    }
                    if (this.isBottomUpdatingContent) {
                        this.topReachedDistance = viewport.scrollTop - SCROLLBAR_DISTANCE_DELTA
                        this.bottomReachedDistance =
                            (viewport.scrollHeight - viewport.clientHeight) * (1 - SCROLLBAR_UPDATE_DISTANCE_FACTOR)
                    }

                    if (!this.isTopUpdatingContent && !this.isBottomUpdatingContent && !this.isScrollDown) {
                        this.topReachedDistance =
                            (viewport.scrollHeight - viewport.clientHeight) * SCROLLBAR_UPDATE_DISTANCE_FACTOR
                        this.bottomReachedDistance =
                            (viewport.scrollHeight - viewport.clientHeight) * (1 - SCROLLBAR_UPDATE_DISTANCE_FACTOR)

                        const scroll = this.scroll.getValue()
                        if (scroll === null) {
                            viewport.scrollTop = height
                        } else {
                            viewport.scrollTop = scroll
                        }
                    }
                })
            )
            .subscribe()

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((activeReceiverID) =>
                    combineLatest([of(activeReceiverID), this.scrollDispatcher.scrolled(200)])
                ),
                filter(([_, scrollable]) => !scrollable),
                tap(([activeReceiverID]) =>
                    this.ngZone.run(() => {
                        if (activeReceiverID === null) return

                        const ignoreScroll = this.ignoreScroll
                        this.ignoreScroll = false

                        if (!ignoreScroll) this.scroll.next(viewport.scrollTop)

                        if (
                            this.topReachedDistance !== null &&
                            viewport.scrollTop < this.topReachedDistance &&
                            !this.isScrollDown
                        ) {
                            if (this.isEmitTopReachedEvent) {
                                this.isEmitTopReachedEvent = false

                                this.isTopUpdatingContent = true
                                this.isBottomUpdatingContent = false

                                this.scrollService.emitSideReached('top')
                            }
                        } else {
                            this.isEmitTopReachedEvent = true
                        }

                        if (
                            this.bottomReachedDistance !== null &&
                            viewport.scrollTop > this.bottomReachedDistance &&
                            !this.isScrollDown
                        ) {
                            if (this.isEmitBottomReachedEvent) {
                                this.isEmitBottomReachedEvent = false

                                this.isBottomUpdatingContent = true
                                this.isTopUpdatingContent = false

                                this.scrollService.emitSideReached('bottom')
                            }
                        } else {
                            this.isEmitBottomReachedEvent = true
                        }

                        const allowScrollBottom = this.scrollService.getAllowScrollBottom()

                        if (
                            this.isScrollDown ||
                            (allowScrollBottom === false &&
                                viewport.scrollTop >=
                                    viewport.scrollHeight - viewport.clientHeight - viewport.clientHeight)
                        ) {
                            this.scrollService.emitIsViewedScrollBottom(false)
                        } else {
                            this.scrollService.emitIsViewedScrollBottom(true)
                        }
                    })
                )
            )
            .subscribe()
    }

    ngAfterViewChecked() {
        const viewport = document.documentElement

        if (
            this.isScrollDown &&
            viewport.scrollTop >= viewport.scrollHeight - viewport.clientHeight - SCROLLBAR_DISTANCE_DELTA
        ) {
            this.isScrollDown = false
        }

        if (viewport.scrollHeight !== this.height.getValue()) {
            this.ignoreScroll = true
            this.height.next(viewport.scrollHeight)
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
