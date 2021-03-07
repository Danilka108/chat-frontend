import { ScrollDispatcher } from '@angular/cdk/scrolling'
import { AfterViewChecked, Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, BehaviorSubject, forkJoin, of, Subscription } from 'rxjs'
import { filter, first, observeOn, switchMap, tap } from 'rxjs/operators'
import { updateDialogScroll } from 'src/app/store/actions/main.actions'
import {
    selectActiveReceiverID,
    selectDialogIsUploaded,
    selectDialogMessages,
    selectDialogScroll,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { ScrollBottomService } from '../../services/scroll-bottom.service'

const SCROLLBAR_UPLOAD_EVENT_FACTOR = 0.3

@Component({
    selector: 'app-main-dialogs-scroll',
    templateUrl: './dialogs-scroll.component.html',
    styleUrls: ['./dialogs-scroll.component.scss'],
})
export class DialogsScrollComponent implements OnInit, AfterViewChecked, OnDestroy {
    @Output() topReached = new EventEmitter<void>()

    height = new BehaviorSubject(0)
    height$ = this.height.asObservable()

    uploadingContent = false

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly scrollBottomService: ScrollBottomService,
        private readonly scrollDispatcher: ScrollDispatcher,
        private readonly ngZone: NgZone
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit() {
        const viewport = document.documentElement

        this.sub = this.scrollBottomService
            .getScrollBottom()
            .pipe(
                tap(() => {
                    viewport.scrollTo({
                        top: viewport.scrollHeight,
                        behavior: 'smooth',
                    })
                })
            )
            .subscribe()

        this.sub = this.height$
            .pipe(
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                switchMap((receiverID) =>
                    receiverID === null ? of(null) : this.store.pipe(select(selectDialogScroll, { receiverID }))
                ),
                tap((scroll) => {
                    if (!this.uploadingContent) {
                        if (scroll === null) {
                            viewport.scrollTop = viewport.scrollHeight
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
                switchMap((receiverID) =>
                    receiverID === null ? of(null) : this.store.pipe(select(selectDialogMessages, { receiverID }))
                ),
                observeOn(asyncScheduler),
                tap(() => {
                    if (this.uploadingContent) this.uploadingContent = false
                })
            )
            .subscribe()

        this.sub = this.scrollDispatcher
            .scrolled(150)
            .pipe(
                filter((scrollable) => !scrollable),
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                switchMap((activeReceiverID) =>
                    forkJoin({
                        activeReceiverID: of(activeReceiverID),
                        isUploaded:
                            activeReceiverID === null
                                ? of(null)
                                : this.store.pipe(
                                      select(selectDialogIsUploaded, { receiverID: activeReceiverID }),
                                      first()
                                  ),
                    })
                ),
                tap(({ isUploaded, activeReceiverID }) => {
                    if (activeReceiverID === null) return

                    this.store.dispatch(
                        updateDialogScroll({ receiverID: activeReceiverID, scroll: viewport.scrollTop })
                    )

                    if (!isUploaded && viewport.scrollTop <= viewport.scrollHeight * SCROLLBAR_UPLOAD_EVENT_FACTOR) {
                        this.ngZone.run(() => {
                            this.topReached.emit()
                            this.uploadingContent = true
                        })
                    }

                    if (viewport.scrollTop <= viewport.scrollHeight - viewport.offsetHeight * 2) {
                        this.scrollBottomService.emitIsViewed(true)
                    } else {
                        this.scrollBottomService.emitIsViewed(false)
                    }
                })
            )
            .subscribe()
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
