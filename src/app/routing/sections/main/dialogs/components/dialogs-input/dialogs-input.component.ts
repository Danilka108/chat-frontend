import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatFormField } from '@angular/material/form-field'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, forkJoin, Observable, of, Subscription } from 'rxjs'
import { first, map, observeOn, switchMap, take, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { addDialogMessages, updateDialogLastMessage } from 'src/app/store/actions/main.actions'
import { selectActiveReceiverID } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { SCROLL_BOTTOM_UPDATE_CONTENT } from '../../dialogs.constants'
import { HttpService } from '../../services/http.service'
import { ScrollService } from '../../services/scroll.service'

@Component({
    selector: 'app-dialogs-input',
    templateUrl: './dialogs-input.component.html',
    styleUrls: ['./dialogs-input.component.scss'],
})
export class DialogsInputComponent implements AfterViewInit, OnDestroy {
    @ViewChild('textarea') matFormField!: MatFormField
    @ViewChild('autosize') autosize!: CdkTextareaAutosize

    formGroup = new FormGroup({
        message: new FormControl(null),
    })

    btnSize = 0

    loading = false

    isPlaceholderVisible = true

    subscription = new Subscription()

    constructor(
        private readonly ngZone: NgZone,
        private readonly httpService: HttpService,
        private readonly dateService: DateService,
        private readonly scrollService: ScrollService,
        private readonly store: Store<AppState>,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    triggerResize(): void {
        this.sub = this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.autosize.resizeToFitContent(true)
        })
    }

    ngAfterViewInit(): void {
        this.sub = (this.formGroup.get('message')?.valueChanges as Observable<string | null>)
            .pipe(
                tap((messageValue) => {
                    if (messageValue === null || !messageValue.length) this.isPlaceholderVisible = true
                    else this.isPlaceholderVisible = false
                })
            )
            .subscribe()

        this.btnSize = (this.matFormField._elementRef.nativeElement as HTMLElement).offsetHeight

        this.changeDetectorRef.detectChanges()
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }

    onSubmit(): void {
        const message = this.formGroup.get('message')?.value as string

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

    completeSubmit(): void {
        this.loading = false
        this.formGroup.setValue({
            message: null,
        })
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && event.ctrlKey) {
            const messageValue = this.formGroup.get('message')?.value as string | null

            this.formGroup.setValue({
                message: messageValue === null ? null : messageValue + '\n',
            })
        } else if (event.key == 'Enter') {
            event.preventDefault()

            this.onSubmit()
        }
    }

    isMessageEmpty(): boolean {
        const msg = (this.formGroup.get('message')?.value as string) || null

        if (msg === null || msg.length === 0) {
            return true
        }
        return false
    }
}
