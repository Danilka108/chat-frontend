import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { BehaviorSubject, of, Subscription } from 'rxjs'
import { filter, first, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { decreaseDialogNewMessagesCount, markDialogMessageAsRead } from 'src/app/store/actions/main.actions'
import { selectActiveReceiverID, selectIsDarkTheme } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { HttpService } from '../../services/http.service'
import { ScrollService } from '../../services/scroll.service'

@Component({
    selector: 'app-dialogs-message',
    templateUrl: './dialogs-message.component.html',
    styleUrls: ['./dialogs-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsMessageComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @HostBinding('class.dark-theme') isDarkTheme = false

    @Input() @HostBinding('class.own-msg') isOwnMsg!: boolean
    @Input() @HostBinding('class.last-in-group') isLastInGroup!: boolean
    @Input() wrapperWidthFactor!: number
    @Input() message!: string
    @Input() date!: string
    @Input() wrapperWidth!: number
    @Input() isReaded!: boolean
    @Input() messageID!: number

    @ViewChild('messageWrapper') messageWrapper!: ElementRef<HTMLElement>

    updateScrollListener = new BehaviorSubject<void>(undefined)
    updateScrollListener$ = this.updateScrollListener.asObservable()

    subscription = new Subscription()

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    constructor(
        private readonly dateService: DateService,
        private readonly scrollService: ScrollService,
        private readonly store: Store<AppState>,
        private readonly httpService: HttpService,
        readonly elementRef: ElementRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.isReaded && changes.isReaded.previousValue !== changes.isReaded.currentValue) {
            this.updateScrollListener.next()
        }
    }

    ngOnInit(): void {
        this.sub = this.store
            .pipe(
                select(selectIsDarkTheme),
                tap((isDarkTheme) => {
                    this.isDarkTheme = isDarkTheme
                })
            )
            .subscribe()
    }

    ngAfterViewInit(): void {
        const messageWrapper = this.messageWrapper.nativeElement

        this.sub = this.scrollService
            .getTopAnchorMessageID()
            .pipe(
                tap((messageID) => {
                    if (messageID === this.messageID) {
                        this.scrollService.updateTopAnchor(messageWrapper)
                    }
                })
            )
            .subscribe()

        this.sub = this.updateScrollListener$
            .pipe(
                switchMap(() => (!this.isOwnMsg && !this.isReaded ? this.scrollService.getScrolled() : of(null))),
                switchMap((result) => {
                    if (result === null) return of(null)

                    const viewport = this.scrollService.getViewport()
                    const { y: messageWrapperYPos } = messageWrapper.getBoundingClientRect()

                    if (viewport !== null) {
                        const { y: viewportYPos, height: viewportHeight } = viewport.getBoundingClientRect()

                        if (messageWrapperYPos > viewportYPos && messageWrapperYPos < viewportYPos + viewportHeight) {
                            return this.httpService.messageRead(this.messageID)
                        }

                        return of(null)
                    }

                    if (messageWrapperYPos > 0 && messageWrapperYPos < window.innerHeight) {
                        return this.httpService.messageRead(this.messageID)
                    }

                    return of(null)
                }),
                filter((result) => result !== null),
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                tap((receiverID) => {
                    if (receiverID !== null) {
                        this.store.dispatch(decreaseDialogNewMessagesCount({ receiverID }))
                        this.store.dispatch(markDialogMessageAsRead({ receiverID, messageID: this.messageID }))
                        this.scrollService.emitMessagesRead()
                    }
                })
            )
            .subscribe()
    }

    parseDate(date: string): string {
        return this.dateService.parseDate(date)
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
