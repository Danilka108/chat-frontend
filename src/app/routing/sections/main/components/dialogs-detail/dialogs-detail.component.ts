import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, Subscription } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import {
    addDialogMessages,
    updateDialogIsUpload,
    updateDialogSkip,
    updateDialogsNotReadedMessagesCount,
} from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import { getUserID } from 'src/app/store/selectors/auth.selectors'
import {
    getActiveReceiverID,
    getDialogMessages,
    getDialogs,
    getDialogSkip,
} from 'src/app/store/selectors/main.selectors'
import { IAppState } from 'src/app/store/states/app.state'
import { IMessageWithIsLast } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { MessageService } from '../../services/message.service'

const TAKE_MESSAGES_FACTOR = 1 / 15

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsDetailComponent implements OnInit, OnDestroy {
    @Input() topReachedEvent!: Observable<void>

    messages$!: Observable<IMessageWithIsLast[]>
    isSelectedReceiver$ = of(true)

    take = 0

    sub = new Subscription()

    constructor(
        private readonly httpService: MainSectionHttpService,
        private readonly messageService: MessageService,
        private readonly store: Store<IAppState>
    ) {}

    ngOnInit() {
        this.onWindowResize()

        this.isSelectedReceiver$ = combineLatest([
            this.store.select(getDialogs()),
            this.store.select(getActiveReceiverID()),
        ]).pipe(
            map(([dialogs, activeReceiverID]) => {
                if (activeReceiverID === null) return false

                const index = dialogs.findIndex((dialog) => {
                    return dialog.receiverID === activeReceiverID
                })

                return index > -1
            })
        )

        this.messages$ = this.store.select(getActiveReceiverID()).pipe(
            switchMap((activeReceiverID) => {
                if (activeReceiverID === null) return of(null)

                return this.store.select(getDialogMessages(activeReceiverID))
            }),
            map((dialogMessages) => {
                if (dialogMessages === null) return []

                return this.messageService.parseMessages(dialogMessages.messages)
            })
        )

        this.sub.add(
            this.store
                .select(getDialogs())
                .pipe(
                    switchMap(() => this.store.select(getActiveReceiverID())),
                    switchMap((activeReceiverID) => {
                        if (activeReceiverID) {
                            const dialogMessages = this.store.selectSnapshot(getDialogMessages(activeReceiverID))

                            if (dialogMessages) {
                                return of(null)
                            }

                            return forkJoin({
                                activeReceiverID: of(activeReceiverID),
                                messages: this.httpService.getMessages(activeReceiverID, this.take, 0),
                            })
                        }

                        return of(null)
                    })
                )
                .subscribe((result) => {
                    if (result) {
                        this.store.dispatch(updateDialogSkip(result.activeReceiverID, this.take))
                        this.store.dispatch(addDialogMessages(result.activeReceiverID, result.messages))
                        this.store.dispatch(updateDialogIsUpload(result.activeReceiverID, true))
                        this.store.dispatch(updateDialogsNotReadedMessagesCount(result.activeReceiverID, 0))
                    }
                })
        )

        this.sub = this.topReachedEvent.subscribe(() => this.onTopReached())
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.take = Math.abs(document.documentElement.clientHeight * TAKE_MESSAGES_FACTOR)
    }

    onTopReached() {
        const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

        if (activeReceiverID !== null) {
            const dialogSkip = this.store.selectSnapshot(getDialogSkip(activeReceiverID))

            if (dialogSkip !== null) {
                this.sub.add(
                    this.httpService.getMessages(activeReceiverID, this.take, dialogSkip).subscribe((messages) => {
                        if (messages.length === 0) {
                            this.store.dispatch(updateDialogIsUpload(activeReceiverID, false))
                        } else {
                            this.store.dispatch(addDialogMessages(activeReceiverID, messages))
                            this.store.dispatch(updateDialogSkip(activeReceiverID, dialogSkip + this.take))
                        }
                    })
                )
            }
        }
    }

    getUserID() {
        return this.store.selectSnapshot(getUserID())
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }
}
