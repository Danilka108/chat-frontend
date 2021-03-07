import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import {
    AfterContentChecked,
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { select, Store } from '@ngrx/store'
import { NgScrollbar } from 'ngx-scrollbar'
import { BehaviorSubject, forkJoin, Observable, of, Subject, Subscription } from 'rxjs'
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    first,
    map,
    pairwise,
    startWith,
    switchMap,
    take,
    tap,
} from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { addDialogMessages, updateDialogLastMessage } from 'src/app/store/actions/main.actions'
import { selectActiveReceiverIDAndUserID } from 'src/app/store/selectors/app.selectors'
import { selectActiveReceiverID } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { ScrollBottomService } from '../../services/scroll-bottom.service'

@Component({
    selector: 'app-main-dialogs-input',
    templateUrl: './dialogs-input.component.html',
    styleUrls: ['./dialogs-input.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsInputComponent implements OnInit, AfterViewChecked, OnDestroy {
    @ViewChild('autosize') autosize!: CdkTextareaAutosize
    @ViewChild('scrollbar') scrollbarEl!: ElementRef<HTMLElement>
    @ViewChild(NgScrollbar) scrollbar!: NgScrollbar
    @ViewChild('textarea') textarea!: ElementRef<HTMLElement>

    btnRippleColor = 'rgba(220, 220, 220, 0.17)'
    formGroup!: FormGroup
    btnMargin = 0.6
    btnSize = ''
    loading = false
    subscription = new Subscription()

    height = 0

    constructor(
        private readonly ngZone: NgZone,
        private readonly fb: FormBuilder,
        private readonly httpService: MainSectionHttpService,
        private readonly dateService: DateService,
        private readonly scrollBottomService: ScrollBottomService,
        private readonly store: Store<AppState>
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    triggerZone() {
        this.sub.add(
            this.ngZone.onStable.pipe(take(1)).subscribe(() => {
                this.autosize.resizeToFitContent(true)
            })
        )
    }

    ngOnInit() {
        this.formGroup = this.fb.group({
            message: new FormControl(null),
        })
    }

    ngAfterViewChecked() {
        const height = this.textarea.nativeElement.offsetHeight

        if (height !== this.height) {
            if (this.height === 0) this.btnSize = `calc(${height}px + ${this.btnMargin * 2}rem)`

            this.height = height

            this.scrollbarEl.nativeElement.style.height = this.height + 'px'
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    onSubmit() {
        const message = this.formGroup.get('message')?.value as string | null

        if (!this.loading && message !== null) {
            this.loading = true

            this.sub = this.store
                .pipe(
                    select(selectActiveReceiverID),
                    switchMap((activeReceiverID) => {
                        if (activeReceiverID === null) return of(null)

                        return this.httpService.sendMessage(activeReceiverID, message)
                    }),
                    switchMap((messageID) =>
                        forkJoin({
                            messageID: of(messageID),
                            state: this.store.pipe(select(selectActiveReceiverIDAndUserID), first()),
                        })
                    ),
                    map(({ messageID, state: { activeReceiverID, userID } }) => {
                        if (messageID && activeReceiverID && userID) {
                            const nowDate = this.dateService.now()

                            this.store.dispatch(
                                addDialogMessages({
                                    receiverID: activeReceiverID,
                                    messages: [
                                        {
                                            senderID: userID,
                                            receiverID: activeReceiverID,
                                            message,
                                            messageID,
                                            createdAt: nowDate,
                                            updatedAt: nowDate,
                                            isReaded: false,
                                            isUpdated: false,
                                        },
                                    ],
                                })
                            )

                            this.store.dispatch(
                                updateDialogLastMessage({
                                    receiverID: activeReceiverID,
                                    lastMessage: message,
                                    createdAt: nowDate,
                                })
                            )

                            this.scrollBottomService.emitScrollBottom()
                        }

                        this.completeSubmit()
                    })
                )
                .subscribe()
        }
    }

    completeSubmit() {
        this.loading = false
        this.formGroup.setValue({
            message: null,
        })
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && event.ctrlKey) {
            const messageValue = this.formGroup.get('message')?.value as string | null

            this.formGroup.setValue({
                message: messageValue + '\n',
            })
        } else if (event.key == 'Enter') {
            event.preventDefault()

            this.onSubmit()
        }
    }

    isMessageEmpty() {
        const msg = (this.formGroup.get('message')?.value as string) || null

        if (msg === null || msg.length === 0) {
            return true
        }
        return false
    }
}
