import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core'
import { fromEvent, Observable, of, Subject, Subscription } from 'rxjs'
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

const SCROLLBAR_UPLOAD_EVENT_FACTOR = 0.25

@Component({
    selector: 'app-main-dialogs-scroll',
    templateUrl: './dialogs-scroll.component.html',
    styleUrls: ['./dialogs-scroll.component.scss'],
})
export class DialogsScrollComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('scrollbar') scrollbar!: ElementRef
    @ViewChild('content') content!: ElementRef

    @Input() scrollToBottomEvent!: Observable<void>
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

    constructor(private readonly store: Store<IAppState>) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngAfterViewInit() {
        const scrollbar = this.scrollbar.nativeElement as HTMLElement

        this.sub = this.scrollToBottomEvent
            .pipe(
                map(() => {
                    setTimeout(() => (scrollbar.scrollTop = this.contentHeight.current))
                })
            )
            .subscribe()

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
                        setTimeout(() => {
                            const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

                            if (activeReceiverID !== null) {
                                this.store.dispatch(updateDialogScroll(activeReceiverID, scrollbar.scrollTop))
                            }

                            this.updatingContent = false
                        })
                    }
                }),
                catchError(() => of())
            )
            .subscribe()

        this.sub = this.store
            .select(getActiveReceiverID())
            .pipe(
                switchMap(() => this.height$),
                map(() => {
                    const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

                    if (activeReceiverID !== null) {
                        return this.store.selectSnapshot(getDialogScroll(activeReceiverID))
                    }

                    return null
                }),
                map((scroll) => {
                    if (scroll !== null) return scroll
                    return this.contentHeight.current
                }),
                map((scroll) => {
                    if (this.updatingContent) {
                        const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

                        if (activeReceiverID !== null) {
                            const prevScroll = this.store.selectSnapshot(getDialogScroll(activeReceiverID))

                            if (prevScroll !== null) {
                                scrollbar.scrollTop =
                                    prevScroll + this.contentHeight.current - this.contentHeight.previous
                            }
                        }
                    } else {
                        scrollbar.scrollTop = scroll
                    }
                })
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
                            scrollbar.scrollTop === 0 &&
                            !ignore
                        ) {
                            this.updatingContent = true
                            this.topReached.emit()
                        }
                    }
                })
            )
            .subscribe()
    }

    ngAfterViewChecked() {
        const content = this.content.nativeElement as HTMLElement

        if (content.offsetHeight !== this.contentHeight.current) {
            this.ignoreScroll = true

            if (content.offsetHeight > this.contentHeight.current) {
                this.contentHeight.previous = this.contentHeight.current
            }

            this.contentHeight.current = content.offsetHeight

            this.height.next()
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
