import { ScrollDispatcher } from '@angular/cdk/scrolling'
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, HostListener, NgZone, OnDestroy, OnInit, Output } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, BehaviorSubject, combineLatest, forkJoin, of, Subscription } from 'rxjs'
import { filter, first, observeOn, startWith, switchMap, tap } from 'rxjs/operators'
import {
    selectActiveReceiverID,
    selectDialogIsUploaded,
    selectDialogMessages,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { ScrollService } from '../../services/scroll.service'

const SCROLLBAR_UPLOAD_EVENT_DISTANCE_FACTOR = 3

@Component({
    selector: 'app-main-dialogs-scroll',
    templateUrl: './dialogs-scroll.component.html',
    styleUrls: ['./dialogs-scroll.component.scss'],
})
export class DialogsScrollComponent implements OnInit, AfterViewChecked, OnDestroy {
    height = new BehaviorSubject(0)
    height$ = this.height.asObservable()

    uploadingContent = false

    disableScroll = false

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly scrollService: ScrollService,
        private readonly scrollDispatcher: ScrollDispatcher,
        private readonly ngZone: NgZone,
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    @HostListener('mousewheel', ['$event'])
    onMousewheel(event: WheelEvent) {
        if (!event.ctrlKey && this.disableScroll) {
            event.preventDefault()
        }
    }

    @HostListener('touchmove', ['$event'])
    onMousemove(event: TouchEvent) {
        if (this.disableScroll) {
            event.preventDefault()
        }
    }

    ngOnInit() {
        const viewport = document.documentElement

        this.sub = this.scrollService
            .getScrollBottom()
            .pipe(
                tap(() => {
                    this.disableScroll = true

                    viewport.scrollTo({
                        top: viewport.scrollHeight,
                        behavior: 'smooth',
                    })
                })
            )
            .subscribe()

        this.sub = this.store.pipe(
            select(selectActiveReceiverID),
            tap(() => {
                this.uploadingContent = false
            }),
            switchMap(() => this.height$),
            startWith(0),
            tap((height) => {
                if (!this.uploadingContent) viewport.scrollTop = height
            })
        ).subscribe()

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((receiverID) =>
                    receiverID === null ? of(null) : this.store.pipe(select(selectDialogMessages, { receiverID }))
                ),
                observeOn(asyncScheduler),
                tap(() => {
                    this.uploadingContent = false
                })
            )
            .subscribe()

        this.sub = this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((activeReceiverID) => combineLatest([
                of(activeReceiverID),
                this.scrollDispatcher.scrolled(150),
            ])),
            filter(([_, scrollable]) => !scrollable),
            tap(([activeReceiverID]) => {
                if (activeReceiverID === null) return

                if (viewport.scrollTop <= document.documentElement.clientHeight * SCROLLBAR_UPLOAD_EVENT_DISTANCE_FACTOR) {
                    this.ngZone.run(() => {
                        this.uploadingContent = true
                        this.scrollService.emitTopReached()
                    })
                }

                if (!this.disableScroll && viewport.scrollTop <= viewport.scrollHeight - viewport.offsetHeight * 2) {
                    this.scrollService.emitIsViewed(true)
                } else {
                    this.scrollService.emitIsViewed(false)
                }

                if (viewport.scrollTop <= viewport.scrollHeight - viewport.offsetHeight + 10 &&
                    viewport.scrollTop >= viewport.scrollHeight - viewport.offsetHeight - 10
                ) {
                    this.disableScroll = false
                }
            })
        ).subscribe()

        // this.sub = this.scrollDispatcher
        //     .scrolled(150)
        //     .pipe(
        //         filter((scrollable) => !scrollable),
        //         switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
        //         tap((activeReceiverID) => {
        //             if (activeReceiverID === null) return

        //             if (viewport.scrollTop <= viewport.scrollHeight * SCROLLBAR_UPLOAD_EVENT_FACTOR) {
        //                 this.ngZone.run(() => {
        //                     this.uploadingContent = true
        //                     this.scrollService.emitTopReached()
        //                 })
        //             }

        //             if (!this.disableScroll && viewport.scrollTop <= viewport.scrollHeight - viewport.offsetHeight * 2) {
        //                 this.scrollService.emitIsViewed(true)
        //             } else {
        //                 this.scrollService.emitIsViewed(false)
        //             }

        //             if (viewport.scrollTop <= viewport.scrollHeight - viewport.offsetHeight + 10 &&
        //                 viewport.scrollTop >= viewport.scrollHeight - viewport.offsetHeight - 10
        //             ) {
        //                 this.disableScroll = false
        //             }
        //         })
        //     )
        //     .subscribe()
    }

    ngAfterViewChecked() {
        const viewport = document.documentElement

        if (viewport.scrollHeight !== this.height.getValue()) {
            this.height.next(viewport.scrollHeight)
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}