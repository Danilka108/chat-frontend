import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { NgScrollbar } from 'ngx-scrollbar'
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, Subject, Subscription } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { addDialogMessages, updateDialogScroll } from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import { getUserID } from 'src/app/store/selectors/auth.selectors'
import {
    getActiveReceiverID,
    getDialogMessages,
    getDialogs,
    getDialogScroll,
} from 'src/app/store/selectors/main.selectors'
import { IAppState } from 'src/app/store/states/app.state'
import { IMessage, IMessageWithIsLast } from '../../interface/message.interface'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { MessageService } from '../../services/message.service'

@Component({
    selector: 'app-main-dialogs-detail',
    templateUrl: './dialogs-detail.component.html',
    styleUrls: ['./dialogs-detail.component.scss'],
})
export class DialogsDetailComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    messages$!: Observable<IMessageWithIsLast[]>
    isSelectedReceiver$ = of(true)

    take = 30
    skip = 0

    wrapperHeight = new BehaviorSubject(0)
    wrapperHeight$ = this.wrapperHeight.asObservable()

    scroll = new BehaviorSubject(0)
    scroll$ = this.scroll.asObservable()

    sub = new Subscription()

    @ViewChild('scrollbar') scrollbar!: NgScrollbar
    @ViewChild('wrapper') wrapper!: ElementRef

    constructor(
        private readonly httpService: MainSectionHttpService,
        private readonly messageService: MessageService,
        private readonly store: Store<IAppState>
    ) {}

    ngOnInit() {
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
            map((activeReceiverID) => {
                if (!activeReceiverID) throw null
                return {
                    activeReceiverID,
                    dialogMessages: this.store.selectSnapshot(getDialogMessages(activeReceiverID)),
                }
            }),
            switchMap(({ activeReceiverID, dialogMessages }) => {
                let messages$: Observable<IMessage[]>

                if (dialogMessages === null) {
                    messages$ = this.httpService.getMessages(activeReceiverID, this.take, this.skip).pipe(
                        tap((messages) => {
                            this.store.dispatch(addDialogMessages(activeReceiverID, messages))
                        })
                    )
                } else {
                    messages$ = of(dialogMessages.messages)
                }

                return messages$
            }),
            map((messages) => {
                return this.messageService.parseMessages(messages)
            }),
            catchError(() => [])
        )
    }

    ngAfterViewInit() {
        this.sub.add(
            this.store
                .select(getActiveReceiverID())
                .pipe(
                    map((activeReceiverID) => {
                        if (activeReceiverID) {
                            const scroll = this.store.selectSnapshot(getDialogScroll(activeReceiverID))

                            if (scroll !== null) return scroll
                            return null
                        }
                        return null
                    }),
                    switchMap((scroll) => {
                        if (scroll === null) {
                            return this.wrapperHeight$
                        }
                        return of(scroll)
                    })
                )
                .subscribe((scroll) => {
                    this.scroll.next(scroll)
                })
        )

        this.sub.add(
            this.scrollbar.scrolled.subscribe((event) => {
                const scroll = (<HTMLElement>(<Event>event).target).scrollTop
                const activeReceiverID = this.store.selectSnapshot(getActiveReceiverID())

                if (activeReceiverID) {
                    this.store.dispatch(updateDialogScroll(activeReceiverID, scroll))
                }
            })
        )

        this.sub.add(
            this.scroll$.subscribe((scroll) => {
                setTimeout(() => {
                    this.scrollbar.scrollTo({
                        top: scroll,
                        duration: 0,
                    })
                })
            })
        )
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }

    ngAfterViewChecked() {
        const wrapperHeight = (<HTMLElement>this.wrapper.nativeElement).offsetHeight

        if (wrapperHeight !== this.wrapperHeight.getValue()) {
            this.wrapperHeight.next(wrapperHeight)
        }
    }

    getUserID() {
        return this.store.selectSnapshot(getUserID())
    }
}
