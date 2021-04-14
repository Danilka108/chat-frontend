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
import { debounceTime, filter, first, observeOn, switchMap, tap } from 'rxjs/operators'
import { selectActiveReceiverID, selectReconnectionLoading } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import {
    NEW_MESSAGE_END,
    ScrollService,
    SCROLL_BOTTOM_UPDATE_SCROLL,
    SIDE_REACED_BOTTOM,
    SIDE_REACHED_TOP,
} from '../../services/scroll.service'

const SCROLLBAR_UPDATE_DISTANCE_FACTOR = 0.3
const SCROLLBAR_DISTANCE_DELTA = 10

@Component({
    selector: 'app-main-dialogs-scroll',
    templateUrl: './dialogs-scroll.component.html',
    styleUrls: ['./dialogs-scroll.component.scss'],
})
export class DialogsScrollComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('viewport') viewportRef!: ElementRef<HTMLElement>

    height = new BehaviorSubject(0)
    height$ = this.height.asObservable()

    topAnchorScroll = new BehaviorSubject<null | number>(null)
    topAnchorScroll$ = this.topAnchorScroll.asObservable()

    bottomAnchorScroll = new BehaviorSubject<null | number>(null)
    bottomAnchorScroll$ = this.bottomAnchorScroll.asObservable()

    topReachedDistance: null | number = null
    bottomReachedDistance: null | number = null

    isTopUpdatingContent = false
    isBottomUpdatingContent = false

    isDisableUserScroll = false
    isDisableEvents = false

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
                    this.topAnchorScroll.next(null)
                    this.bottomAnchorScroll.next(null)
                    this.scrollService.emitIsViewedScrollBottom(false)
                })
            )
            .subscribe()

        this.sub = this.scrollService
            .getNewMessage()
            .pipe(
                tap((type) => {
                    if (type === NEW_MESSAGE_END) {
                        this.isDisableEvents = false
                        return
                    }

                    this.isDisableEvents = true
                })
            )
            .subscribe()

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

                    viewport.scrollTo({
                        top: viewport.scrollHeight - viewport.clientHeight,
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
                    if ((!this.isTopUpdatingContent && !this.isBottomUpdatingContent) || this.isDisableEvents) {
                        this.topReachedDistance =
                            (viewport.scrollHeight - viewport.clientHeight) * SCROLLBAR_UPDATE_DISTANCE_FACTOR
                        this.bottomReachedDistance =
                            (viewport.scrollHeight - viewport.clientHeight) * (1 - SCROLLBAR_UPDATE_DISTANCE_FACTOR)
                    }

                    if (this.isDisableEvents) return

                    if (!this.isTopUpdatingContent && !this.isBottomUpdatingContent) {
                        const scroll = this.topAnchorScroll.getValue()

                        if (scroll === null) {
                            viewport.scrollTop = height
                        } else {
                            viewport.scrollTop = scroll
                        }
                    }

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

                    if (
                        this.topReachedDistance !== null &&
                        this.topReachedDistance >
                            (viewport.scrollHeight - viewport.clientHeight) * SCROLLBAR_UPDATE_DISTANCE_FACTOR
                    ) {
                        this.topReachedDistance =
                            (viewport.scrollHeight - viewport.clientHeight) * SCROLLBAR_UPDATE_DISTANCE_FACTOR
                    }

                    if (
                        this.bottomReachedDistance !== null &&
                        this.bottomReachedDistance <
                            (viewport.scrollHeight - viewport.clientHeight) * (1 - SCROLLBAR_UPDATE_DISTANCE_FACTOR)
                    ) {
                        this.bottomReachedDistance =
                            (viewport.scrollHeight - viewport.clientHeight) * (1 - SCROLLBAR_UPDATE_DISTANCE_FACTOR)
                    }
                }),
                tap(() => {
                    this.ignoreScroll = false
                })
            )
            .subscribe()

        this.sub = this.scrollService
            .getDiscardUpdatingContent()
            .pipe(
                tap(() => {
                    this.isTopUpdatingContent = false
                    this.isBottomUpdatingContent = false
                })
            )
            .subscribe()

        this.sub = this.scrollDispatcher
            .scrolled()
            .pipe(
                // filter((scrollable) => !!scrollable),
                tap(() =>
                    this.ngZone.run(() => {
                        const topAnchor = this.scrollService.getTopAnchor()

                        if (topAnchor && !this.ignoreScroll) {
                            this.topAnchorScroll.next(viewport.scrollTop - topAnchor.nativeElement.offsetTop)
                        }

                        const bottomAnchor = this.scrollService.getBottomAnchor()

                        if (bottomAnchor && !this.ignoreScroll) {
                            this.bottomAnchorScroll.next(
                                // bottomAnchor.nativeElement.getBoundingClientRect().y + pageYOffset - viewport.scrollTop
                                bottomAnchor.nativeElement.offsetTop - viewport.scrollTop
                            )
                        }
                    })
                )
            )
            .subscribe()

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
                debounceTime(200),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                // filter(({ scrollable }) => !!scrollable),
                tap(({ activeReceiverID, reconnectionLoading }) =>
                    this.ngZone.run(() => {
                        if (activeReceiverID === null) return

                        if (!this.ignoreScroll) {
                            this.scrollService.emitScrolled()
                        }

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

                        const allowScrollBottom = this.scrollService.getAllowScrollBottom()

                        if (
                            this.isDisableUserScroll ||
                            (allowScrollBottom === false &&
                                viewport.scrollTop >= viewport.scrollHeight - viewport.clientHeight * 2)
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

    ngAfterViewChecked(): void {
        const viewport = this.viewportRef.nativeElement

        if (
            this.isDisableUserScroll &&
            viewport.scrollTop >= viewport.scrollHeight - viewport.clientHeight - SCROLLBAR_DISTANCE_DELTA * 2
        ) {
            this.isDisableUserScroll = false
            this.isDisableEvents = false
        }

        if (viewport.scrollHeight !== this.height.getValue()) {
            this.ignoreScroll = true

            if (this.isTopUpdatingContent && !this.isDisableEvents) {
                const topAnchorScroll = this.topAnchorScroll.getValue()
                const topAnchor = this.scrollService.getTopAnchor()

                if (topAnchor !== null) {
                    viewport.scrollTop =
                        topAnchor.nativeElement.offsetTop + (topAnchorScroll === null ? 0 : topAnchorScroll)
                }
            }

            if (this.isBottomUpdatingContent && !this.isDisableEvents) {
                const bottomAnchorScroll = this.bottomAnchorScroll.getValue()
                const bottomAnchor = this.scrollService.getBottomAnchor()

                if (bottomAnchor !== null) {
                    viewport.scrollTop =
                        bottomAnchor.nativeElement.offsetTop - (bottomAnchorScroll === null ? 0 : bottomAnchorScroll)
                }
            }

            this.height.next(viewport.scrollHeight)
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
