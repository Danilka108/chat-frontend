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
import { forkJoin, Observable, of, Subject, Subscription } from 'rxjs'
import { first, map, switchMap, take, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { addDialogMessages, updateDialogLastMessage } from 'src/app/store/actions/main.actions'
import { selectActiveReceiverIDAndUserID } from 'src/app/store/selectors/app.selectors'
import { selectActiveReceiverID } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { ScrollService } from '../../services/scroll.service'

@Component({
    selector: 'app-main-dialogs-input',
    templateUrl: './dialogs-input.component.html',
    styleUrls: ['./dialogs-input.component.scss'],
})
export class DialogsInputComponent {
    @ViewChild('autosize') autosize!: CdkTextareaAutosize
    @ViewChild('textarea') textarea!: ElementRef<HTMLElement>

    btnRippleColor = 'rgba(220, 220, 220, 0.17)'

    formGroup!: FormGroup

    btnMargin = 0.6
    btnSize = ''
    scrollbarHeight = 0

    loading = false
    subscription = new Subscription()

    height = 0

    isViewed = new Subject<boolean>()
    isViewed$ = this.isViewed.asObservable()
    isDisabled = false

    constructor(
        private readonly ngZone: NgZone,
        private readonly fb: FormBuilder,
        private readonly httpService: MainSectionHttpService,
        private readonly dateService: DateService,
        private readonly scrollService: ScrollService,
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
        this.sub = this.scrollService
            .getIsViewed()
            .pipe(
                tap((isViewed) => {
                    setTimeout(() => this.isViewed.next(isViewed))
                })
            )
            .subscribe()

        this.sub = this.isViewed$.subscribe((isViewed) => {
            if (isViewed) {
                this.isDisabled = false
            }
        })

        this.formGroup = this.fb.group({
            message: new FormControl(null),
        })
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

                            this.scrollService.emitScrollBottom()
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

    onClick() {
        this.scrollService.emitScrollBottom()
        this.isDisabled = true
    }
}
