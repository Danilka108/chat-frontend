import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import { Component, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { BehaviorSubject, Subscription } from 'rxjs'
import { take } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { addDialogMessages, addDialogs } from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import { getUserID } from 'src/app/store/selectors/auth.selectors'
import { getActiveReceiverID, getDialog } from 'src/app/store/selectors/main.selectors'
import { IAppState } from 'src/app/store/states/app.state'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { ScrollBottomService } from '../../services/scroll-bottom.service'

@Component({
    selector: 'app-main-dialogs-input',
    templateUrl: './dialogs-input.component.html',
    styleUrls: ['./dialogs-input.component.scss'],
})
export class DialogsInputComponent implements OnInit, OnDestroy {
    @ViewChild('autosize') autosize!: CdkTextareaAutosize

    btnRippleColor = 'rgba(220, 220, 220, 0.17)'
    formGroup!: FormGroup
    btnSize = 0
    loading = false
    sub = new Subscription()

    height = 0

    constructor(
        private readonly ngZone: NgZone,
        private readonly fb: FormBuilder,
        private readonly httpService: MainSectionHttpService,
        private readonly store: Store<IAppState>,
        private readonly dateService: DateService,
        private readonly scrollBottomService: ScrollBottomService
    ) {}

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

    ngOnDestroy() {
        this.sub.unsubscribe()
    }

    onMessageInputHeightChange(event: number) {
        this.height = event

        setTimeout(() => {
            if (this.btnSize === 0) this.btnSize = event
        })
    }

    onSubmit() {
        const message = this.formGroup.get('message')?.value as string | null

        if (!this.loading && message !== null) {
            this.loading = true

            const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

            if (activeReceiverID) {
                const req = this.httpService.sendMessage(activeReceiverID, message)

                this.sub.add(
                    req.subscribe((messageID) => {
                        const userID = this.store.selectSnapshot(getUserID())
                        const dialog = this.store.selectSnapshot(getDialog(activeReceiverID))
                        const nowDate = this.dateService.now()

                        if (userID && messageID && dialog) {
                            this.store.dispatch(
                                addDialogMessages(activeReceiverID, [
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
                                ])
                            )

                            this.store.dispatch(
                                addDialogs([
                                    {
                                        receiverID: dialog.receiverID,
                                        receiverName: dialog.receiverName,
                                        latestMessage: message,
                                        createdAt: nowDate,
                                        notReadedMessagesCount: dialog.notReadedMessagesCount,
                                    },
                                ])
                            )
                        }

                        this.scrollBottomService.emitScrollBottom(false)

                        this.completeSubmit()
                    })
                )
            } else {
                this.completeSubmit()
            }
        }
    }

    completeSubmit() {
        this.loading = false
        this.formGroup.setValue({
            message: null,
        })
    }

    onTextareaKeydown(event: KeyboardEvent) {
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
