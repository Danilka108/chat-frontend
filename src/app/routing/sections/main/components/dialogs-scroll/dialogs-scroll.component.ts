import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    OnDestroy,
    Output,
    ViewChild,
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { forkJoin, fromEvent, of, Subject, Subscription } from 'rxjs'
import { catchError, debounceTime, first, map, switchMap, tap } from 'rxjs/operators'
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
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    scrollToBottom = false

    subscription = new Subscription()

    constructor(private readonly store: Store<AppState>, private readonly scrollBottomService: ScrollBottomService) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngAfterViewInit() {
        const scrollbar = this.scrollbar.nativeElement as HTMLElement

        this.sub = this.scrollBottomService
            .getScrollBottom()
            .pipe(
                map(({ isUpdatingHeight }) => {
                    if (isUpdatingHeight) {
                        this.scrollToBottom = true
                        this.updatingContent = true
                    } else {
                        scrollbar.scrollTo({
                            top: this.contentHeight.current,
                            behavior: 'smooth',
                        })
                    }
                })
            )
            .subscribe()

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                switchMap((activeReceiverID) => {
                    if (activeReceiverID === null) throw null
                    return this.store.select(selectDialogMessages, { receiverID: activeReceiverID })
                }),
                switchMap(() => this.height$),
                tap(() => {
                    if (this.updatingContent) {
                        setTimeout(() => {
                            this.updatingContent = false
                        })
                    }
                }),
                catchError(() => of())
            )
            .subscribe()

        this.sub = this.height$
            .pipe(
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                switchMap((activeReceiverID) => {
                    if (activeReceiverID === null) {
                        return forkJoin({
                            activeReceiverID: of(null),
                            dialogScroll: of(null),
                        })
                    }

                    return forkJoin({
                        activeReceiverID: of(activeReceiverID),
                        dialogScroll: this.store.pipe(
                            select(selectDialogScroll, { receiverID: activeReceiverID }),
                            first()
                        ),
                    })
                }),
                tap(({ activeReceiverID, dialogScroll }) => {
                    if (this.updatingContent) {
                        scrollbar.scrollTop += this.contentHeight.current - this.contentHeight.previous
                    } else if (activeReceiverID !== null) {
                        if (dialogScroll !== null) {
                            scrollbar.scrollTop = dialogScroll
                        } else {
                            scrollbar.scrollTop = scrollbar.scrollHeight
                        }
                    }

                    if (this.scrollToBottom) {
                        this.updatingContent = false
                        this.scrollToBottom = false

                        scrollbar.scrollTo({
                            top: this.contentHeight.current,
                            behavior: 'smooth',
                        })
                    }
                })
            )
            .subscribe()

        this.sub = fromEvent(scrollbar, 'scroll')
            .pipe(
                debounceTime(20),
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                switchMap((activeReceiverID) => {
                    if (activeReceiverID === null) {
                        return forkJoin({
                            activeReceiverID: of(null),
                            isUploaded: of(null),
                        })
                    }

                    return forkJoin({
                        activeReceiverID: of(activeReceiverID),
                        isUploaded: this.store.pipe(
                            select(selectDialogIsUploaded, { receiverID: activeReceiverID }),
                            first()
                        ),
                    })
                }),
                tap(({ activeReceiverID, isUploaded }) => {
                    const ignore = this.ignoreScroll
                    this.ignoreScroll = false

                    if (activeReceiverID !== null) {
                        if (!ignore) {
                            this.store.dispatch(
                                updateDialogScroll({
                                    receiverID: activeReceiverID,
                                    scroll: scrollbar.scrollTop,
                                })
                            )
                        }

                        if (
                            (isUploaded === false || isUploaded === null) &&
                            scrollbar.scrollTop <= this.contentHeight.current * SCROLLBAR_UPLOAD_EVENT_FACTOR &&
                            !ignore
                        ) {
                            this.updatingContent = true
                            this.topReached.emit()
                        }

                        if (
                            scrollbar.scrollTop + scrollbar.offsetHeight <=
                            scrollbar.scrollHeight - scrollbar.offsetHeight
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
        const content = this.content.nativeElement

        if (content.offsetHeight !== this.contentHeight.current) {
            this.ignoreScroll = true

            if (content.offsetHeight >= this.contentHeight.current) {
                this.contentHeight.previous = this.contentHeight.current
                this.contentHeight.current = content.offsetHeight

                this.height.next()
            } else {
                this.contentHeight.current = content.offsetHeight
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
