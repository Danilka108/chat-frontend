import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    NgZone,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core'
import { fromEvent, of, Subject, Subscription } from 'rxjs'
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators'
import { updateDialogScroll } from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import {
    getActiveReceiverID,
    getDialogIsUpload,
    getDialogMessages,
    getDialogScroll,
} from 'src/app/store/selectors/main.selectors'
import { IAppState } from 'src/app/store/states/app.state'
import { ScrollBottomService } from '../../services/scroll-bottom.service'

const SCROLLBAR_UPLOAD_EVENT_FACTOR = 0.4

@Component({
    selector: 'app-main-dialogs-scroll',
    templateUrl: './dialogs-scroll.component.html',
    styleUrls: ['./dialogs-scroll.component.scss'],
})
export class DialogsScrollComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('scrollbar') scrollbar!: ElementRef<HTMLElement>
    @ViewChild('content') content!: ElementRef<HTMLElement>

    @Output() topReached = new EventEmitter<void>()

    contentHeight = {
        current: 0,
        previous: 0,
    }

    height = new Subject<void>()
    height$ = this.height.asObservable()

    ignoreScroll = true

    updatingContent = false

    subscription = new Subscription()

    constructor(
        private readonly store: Store<IAppState>,
        private readonly scrollBottomService: ScrollBottomService,
        private readonly ngZone: NgZone
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngAfterViewInit() {
        const scrollbar = this.scrollbar.nativeElement as HTMLElement

        this.sub = this.scrollBottomService
            .getScrollBottom()
            .pipe(
                map(({ isSmooth }) => {
                    setTimeout(() => {
                        if (isSmooth) {
                            scrollbar.scrollTo({
                                top: this.contentHeight.current,
                                behavior: 'smooth',
                            })
                        } else {
                            scrollbar.scrollTop = this.contentHeight.current
                        }
                    })
                })
            )
            .subscribe()

        this.store.select(getActiveReceiverID()).pipe(
            map((activeReceiverID) => {
                if (activeReceiverID !== null) {
                    const scroll = this.store.selectSnapshot(getDialogScroll(activeReceiverID))

                    if (scroll !== null) {
                        scrollbar.scrollTop = scroll
                    }
                }
            })
        )

        this.sub = this.store
            .select(getActiveReceiverID())
            .pipe(
                switchMap((activeReceiverID) => {
                    if (activeReceiverID !== null) {
                        return this.store.select(getDialogMessages(activeReceiverID))
                    }
                    throw null
                }),
                switchMap(() => {
                    return this.height$
                }),
                tap(() => {
                    if (this.updatingContent) {
                        setTimeout(() => (this.updatingContent = false))
                    }
                }),
                catchError(() => of())
            )
            .subscribe()

        this.sub = fromEvent(scrollbar, 'scroll')
            .pipe(
                debounceTime(20),
                tap(() => {
                    const ignore = this.ignoreScroll
                    this.ignoreScroll = false

                    const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

                    if (activeReceiverID !== null) {
                        if (!ignore) this.store.dispatch(updateDialogScroll(activeReceiverID, scrollbar.scrollTop))

                        const isUpload = this.store.selectSnapshot(getDialogIsUpload(activeReceiverID))

                        if (
                            (isUpload?.isUpload === true || isUpload === null) &&
                            scrollbar.scrollTop <= this.contentHeight.current * SCROLLBAR_UPLOAD_EVENT_FACTOR &&
                            !ignore
                        ) {
                            this.updatingContent = true
                            this.topReached.emit()
                        }

                        if (
                            scrollbar.scrollTop + scrollbar.offsetHeight <=
                            this.contentHeight.current - scrollbar.offsetHeight
                        ) {
                            this.scrollBottomService.emitIsViewed(true)
                        } else {
                            this.scrollBottomService.emitIsViewed(false)
                        }
                    }
                })
            )
            .subscribe()
    }

    ngAfterViewChecked() {
        const scrollbar = this.scrollbar.nativeElement
        const content = this.content.nativeElement

        if (content.offsetHeight !== this.contentHeight.current) {
            this.ignoreScroll = true

            if (content.offsetHeight >= this.contentHeight.current) {
                this.contentHeight.previous = this.contentHeight.current
                this.contentHeight.current = content.offsetHeight

                if (this.updatingContent) {
                    scrollbar.scrollTop += this.contentHeight.current - this.contentHeight.previous
                } else {
                    const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

                    if (activeReceiverID !== null) {
                        const scroll = this.store.selectSnapshot(getDialogScroll(activeReceiverID))

                        if (scroll !== null) {
                            scrollbar.scrollTop = scroll
                        } else {
                            scrollbar.scrollTop = this.contentHeight.current
                        }
                    }
                }
            } else {
                this.contentHeight.current = content.offsetHeight
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}