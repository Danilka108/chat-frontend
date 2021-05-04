import { ScrollDispatcher } from '@angular/cdk/scrolling'
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    NgZone,
    OnDestroy,
    ViewChild,
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, BehaviorSubject, combineLatest, forkJoin, of, Subscription } from 'rxjs'
import { filter, first, observeOn, switchMap, tap } from 'rxjs/operators'
import { selectActiveReceiverID, selectReconnectionLoading } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import {
    SCROLLBAR_DISTANCE_DELTA,
    SCROLLBAR_UPDATE_DISTANCE_FACTOR,
    SCROLL_BOTTOM_UPDATE_SCROLL,
    SIDE_REACED_BOTTOM,
    SIDE_REACHED_TOP,
} from '../../dialogs.constants'
import { ScrollService } from '../../services/scroll.service'

@Component({
    selector: 'app-dialogs-scroll',
    templateUrl: './dialogs-scroll.component.html',
    styleUrls: ['./dialogs-scroll.component.scss'],
})
export class DialogsScrollComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('viewport') viewportRef!: ElementRef<HTMLElement>

    heightChange = new BehaviorSubject<number | null>(null)
    heightChange$ = this.heightChange.asObservable()

    topReachedDistance: null | number = null
    bottomReachedDistance: null | number = null

    isTopUpdatingContent = false
    isBottomUpdatingContent = false

    scroll: number | null = null
    topAnchorScroll: number | null = null

    isDisableUserScroll = false
    isDisableEvents = false
    isIgnoreScroll = false

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
    onMousewheel(event: WheelEvent): void {
        if (!event.ctrlKey && this.isDisableUserScroll) {
            event.preventDefault()
        }
    }

    @HostListener('touchmove', ['$event'])
    onMousemove(event: TouchEvent): void {
        if (this.isDisableUserScroll) {
            event.preventDefault()
        }
    }

    ngAfterViewInit(): void {
        const viewport = this.viewportRef.nativeElement

        /**
         * SET INITIAL PARAMS
         */
        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                tap(() => {
                    this.isDisableEvents = false
                    this.isDisableUserScroll = false
                    this.isTopUpdatingContent = false
                    this.isBottomUpdatingContent = false
                    this.topReachedDistance = null
                    this.bottomReachedDistance = null
                    this.heightChange.next(null)
                    this.scroll = null
                    this.topAnchorScroll = null
                    this.isIgnoreScroll = false
                    this.scrollService.emitIsViewedScrollBottom(false)
                })
            )
            .subscribe()

        this.sub = this.scrollService
            .getNewMessage()
            .pipe(
                tap(() => {
                    this.scrollService.emitScrolled()
                })
            )
            .subscribe()

        /**
         * SCROLL BOTTOM
         */
        this.sub = this.scrollService
            .getScrollBottom()
            .pipe(
                filter((step) => step === SCROLL_BOTTOM_UPDATE_SCROLL),
                switchMap(() => this.store.pipe(select(selectReconnectionLoading), first())),
                filter((reconnectionLoading) => !reconnectionLoading),
                observeOn(asyncScheduler),
                tap(() => {
                    this.isDisableEvents = true
                    this.isDisableUserScroll = true

                    if (
                        viewport.scrollTop <
                        viewport.scrollHeight - viewport.offsetHeight * (1 + SCROLLBAR_UPDATE_DISTANCE_FACTOR)
                    ) {
                        viewport.scrollTop =
                            viewport.scrollHeight - viewport.offsetHeight * (1 + SCROLLBAR_UPDATE_DISTANCE_FACTOR)
                    }

                    viewport.scrollTo({
                        top: viewport.scrollHeight,
                        behavior: 'smooth',
                    })
                })
            )
            .subscribe()

        /**
         * WORK WITH EVENT DISTANCES & SCROLL_TOP
         */
        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap(() => this.heightChange$),
                tap((height) => {
                    const topReachedDistance = SCROLLBAR_UPDATE_DISTANCE_FACTOR * viewport.clientHeight

                    if (this.isTopUpdatingContent && viewport.scrollTop < topReachedDistance) {
                        this.topReachedDistance = viewport.scrollTop - SCROLLBAR_DISTANCE_DELTA
                    } else {
                        this.topReachedDistance = topReachedDistance
                    }

                    const bottomReachedDistance = (1 - SCROLLBAR_UPDATE_DISTANCE_FACTOR) * viewport.clientHeight

                    if (this.isBottomUpdatingContent && viewport.scrollTop > bottomReachedDistance) {
                        this.bottomReachedDistance = viewport.scrollTop + SCROLLBAR_DISTANCE_DELTA
                    } else {
                        this.bottomReachedDistance = topReachedDistance
                    }

                    if (this.isTopUpdatingContent || this.isBottomUpdatingContent) return

                    if (this.scroll === null && height) {
                        viewport.scrollTop = height
                    } else if (this.scroll !== null) {
                        viewport.scrollTop = this.scroll
                    }
                })
            )
            .subscribe()

        /**
         * SET TOP ANCHOR SCROLL
         */
        this.sub = this.scrollDispatcher
            .scrolled(20)
            .pipe(
                tap(() => {
                    this.ngZone.run(() => {
                        const topAnchor = this.scrollService.getTopAnchor()

                        if (topAnchor && !this.isIgnoreScroll) {
                            this.scroll = viewport.scrollTop

                            this.topAnchorScroll =
                                viewport.getBoundingClientRect().top - topAnchor.getBoundingClientRect().top
                        }
                    })
                })
            )
            .subscribe()

        /**
         * EMIT SIDE REACHED EVENTS
         */
        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((activeReceiverID) =>
                    combineLatest([of(activeReceiverID), this.scrollDispatcher.scrolled(200)])
                ),
                switchMap(([activeReceiverID, scrollable]) =>
                    forkJoin({
                        activeReceiverID: of(activeReceiverID),
                        scrollable: of(scrollable),
                        reconnectionLoading: this.store.pipe(select(selectReconnectionLoading)).pipe(first()),
                    })
                ),
                tap(({ activeReceiverID, reconnectionLoading }) =>
                    this.ngZone.run(() => {
                        if (activeReceiverID === null) return

                        const allowScrollBottom = this.scrollService.getAllowScrollBottom()

                        if (
                            viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight >=
                                viewport.clientHeight &&
                            allowScrollBottom &&
                            !this.isDisableUserScroll
                        ) {
                            this.scrollService.emitIsViewedScrollBottom(true)
                        } else {
                            this.scrollService.emitIsViewedScrollBottom(false)
                        }

                        if (this.isIgnoreScroll) return

                        this.scrollService.emitScrolled()

                        if (
                            this.topReachedDistance !== null &&
                            viewport.scrollTop < this.topReachedDistance &&
                            !this.isTopUpdatingContent &&
                            !this.isDisableEvents &&
                            !reconnectionLoading
                        ) {
                            this.isTopUpdatingContent = true
                            this.isBottomUpdatingContent = false

                            this.scrollService.emitSideReached(SIDE_REACHED_TOP)
                        }

                        if (
                            this.bottomReachedDistance !== null &&
                            viewport.scrollTop > this.bottomReachedDistance &&
                            !this.isBottomUpdatingContent &&
                            !this.isDisableEvents &&
                            !reconnectionLoading
                        ) {
                            this.isBottomUpdatingContent = true
                            this.isTopUpdatingContent = false

                            this.scrollService.emitSideReached(SIDE_REACED_BOTTOM)
                        }
                    })
                )
            )
            .subscribe()

        /**
         * DISCARD UPDATING TOP OR BOTTOM CONTENT
         */
        this.sub = this.scrollService
            .getDiscardUpdatingContent()
            .pipe(
                tap(() => {
                    this.isIgnoreScroll = false
                    this.isTopUpdatingContent = false
                    this.isBottomUpdatingContent = false
                })
            )
            .subscribe()
    }

    ngAfterViewChecked(): void {
        const viewport = this.viewportRef.nativeElement

        if (
            this.isDisableUserScroll &&
            viewport.scrollTop >= viewport.scrollHeight - viewport.clientHeight - SCROLLBAR_DISTANCE_DELTA * 2
        ) {
            this.isDisableUserScroll = false
            this.isDisableEvents = false
        }

        if (viewport.scrollHeight !== this.heightChange.getValue()) {
            this.isIgnoreScroll = true

            if (this.isTopUpdatingContent && !this.isDisableEvents) {
                const topAnchor = this.scrollService.getTopAnchor()

                if (topAnchor !== null) {
                    viewport.scrollTop +=
                        topAnchor.getBoundingClientRect().top -
                        viewport.getBoundingClientRect().top +
                        (this.topAnchorScroll ? this.topAnchorScroll : 0)
                }
            }

            if (this.isBottomUpdatingContent && !this.isDisableEvents) {
                // ...
            }

            this.heightChange.next(viewport.scrollHeight)
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
