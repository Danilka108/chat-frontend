import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import { AfterViewInit, Component, NgZone, ViewChild } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatFormField } from '@angular/material/form-field'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, forkJoin, of, Subscription } from 'rxjs'
import { first, map, observeOn, switchMap, take, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { addDialogMessages, updateDialogLastMessage } from 'src/app/store/actions/main.actions'
import { selectActiveReceiverID } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { ScrollService, SCROLL_BOTTOM_UPDATE_CONTENT } from '../../services/scroll.service'

@Component({
    selector: 'app-main-dialogs-input',
    templateUrl: './dialogs-input.component.html',
    styleUrls: ['./dialogs-input.component.scss'],
})
export class DialogsInputComponent implements AfterViewInit {
    @ViewChild('textarea') matFormField!: MatFormField
    @ViewChild('autosize') autosize!: CdkTextareaAutosize

    formGroup = new FormGroup({
        message: new FormControl(null),
    })

    btnSize = 0

    loading = false
    subscription = new Subscription()

    constructor(
        private readonly ngZone: NgZone,
        private readonly httpService: MainSectionHttpService,
        private readonly dateService: DateService,
        private readonly scrollService: ScrollService,
        private readonly store: Store<AppState>
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    triggerResize() {
        this.sub = this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.autosize.resizeToFitContent(true)
        })
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.btnSize = this.matFormField._elementRef.nativeElement.offsetHeight
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    onSubmit() {
        const message = this.formGroup.get('message')!.value as string

        if (!this.loading && message !== null) {
            this.loading = true

            this.sub = this.store
                .pipe(
                    select(selectActiveReceiverID),
                    first(),
                    switchMap((activeReceiverID) => {
                        if (activeReceiverID === null) return of(null)

                        return this.httpService.sendMessage(activeReceiverID, message)
                    }),
                    switchMap((newMessage) =>
                        forkJoin({
                            newMessage: of(newMessage),
                            activeReceiverID: this.store.pipe(select(selectActiveReceiverID), first()),
                        })
                    ),
                    map(({ newMessage, activeReceiverID }) => {
                        if (newMessage && activeReceiverID) {
                            const nowDate = this.dateService.now()

                            this.store.dispatch(
                                addDialogMessages({
                                    receiverID: activeReceiverID,
                                    messages: [newMessage],
                                })
                            )

                            this.store.dispatch(
                                updateDialogLastMessage({
                                    receiverID: activeReceiverID,
                                    lastMessage: message,
                                    createdAt: nowDate,
                                })
                            )
                        }

                        this.completeSubmit()
                    }),
                    observeOn(asyncScheduler),
                    tap(() => this.scrollService.emitScrollBottom(SCROLL_BOTTOM_UPDATE_CONTENT))
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
            const messageValue = this.formGroup.get('message')!.value as string

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
        // this.scrollService.emitScrollBottom()
        // this.isDisabled = true
    }
}
