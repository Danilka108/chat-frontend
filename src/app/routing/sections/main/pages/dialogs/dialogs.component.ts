import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, combineLatest, forkJoin, Observable, of, Subscription } from 'rxjs'
import { filter, first, map, observeOn, skipWhile, startWith, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import {
    addDialogMessages,
    addDialogs,
    markDialogMessagesAsRead,
    updateActiveReceiverID,
    updateDialogLastMessage,
    updateDialogNewMessagesCount,
} from 'src/app/store/actions/main.actions'
import { selectConnectionError, selectUserID } from 'src/app/store/selectors/auth.selectors'
import {
    selectActiveReceiverID,
    selectDialogNewMessagesCount,
    selectDialogs,
    selectRequestLoading,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { WsEvents } from 'src/app/ws/ws.events'
import { WsService } from 'src/app/ws/ws.service'
import { NoConnectionComponent } from '../../components/no-connection/no-connection.component'
import { IDialog } from '../../interface/dialog.interface'
import { IMessage } from '../../interface/message.interface'
import { NEW_MESSAGE_START, ScrollService } from '../../services/scroll.service'

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.scss'],
})
export class DialogsComponent implements OnInit, OnDestroy {
    noConnectionDialog: MatDialogRef<NoConnectionComponent> | null = null
    requestLoading$!: Observable<boolean>

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly dialog: MatDialog,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly wsService: WsService,
        private readonly dateService: DateService,
        private readonly scrollService: ScrollService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit() {
        this.requestLoading$ = this.store.pipe(select(selectRequestLoading), observeOn(asyncScheduler))

        this.sub = this.store
            .pipe(
                select(selectConnectionError),
                map((isError) => {
                    if (!this.noConnectionDialog && isError) {
                        this.noConnectionDialog = this.dialog.open(NoConnectionComponent, {
                            closeOnNavigation: true,
                            disableClose: true,
                        })
                    } else if (this.noConnectionDialog && !isError) {
                        this.noConnectionDialog.close()
                    }
                })
            )
            .subscribe()

        this.sub = this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith(undefined),
                switchMap(() => {
                    if (!this.route.firstChild) return of(null)

                    return this.route.firstChild.params
                }),
                switchMap((params) =>
                    combineLatest([
                        of(params),
                        this.store.pipe(
                            select(selectDialogs),
                            skipWhile((dialogs) => dialogs === null || dialogs.length === 0),
                            map((dialogs) => (dialogs === null ? [] : dialogs.map((dialog) => dialog.receiverID)))
                        ),
                    ])
                ),
                tap((result) => {
                    const [params, dialogsID] = result

                    if (!params || !dialogsID.length) {
                        this.store.dispatch(updateActiveReceiverID({ activeReceiverID: null }))
                        this.router.navigateByUrl(mainSectionDialogsPath.full)
                        return
                    }

                    const id = Number(params['id'])

                    if (isNaN(id) || !dialogsID.includes(id)) {
                        this.store.dispatch(updateActiveReceiverID({ activeReceiverID: null }))
                        this.router.navigateByUrl(mainSectionDialogsPath.full)
                    } else {
                        this.store.dispatch(updateActiveReceiverID({ activeReceiverID: id }))
                    }
                })
            )
            .subscribe()

        this.sub = this.wsService
            .fromEvent<IMessage>(WsEvents.user.newMessage)
            .pipe(
                switchMap((message) =>
                    forkJoin({
                        message: of(message),
                        userID: this.store.pipe(select(selectUserID), first()),
                    })
                ),
                switchMap(({ message, userID }) => {
                    const receiverID = userID === message.receiverID ? message.senderID : message.receiverID

                    return forkJoin({
                        receiverID: of(receiverID),
                        message: of(message),
                        dialogNewMessagesCount: this.store.pipe(
                            select(selectDialogNewMessagesCount, { receiverID }),
                            first()
                        ),
                    })
                }),
                map(({ message, receiverID, dialogNewMessagesCount }) => {
                    const dlgNewMessagesCount = dialogNewMessagesCount === null ? 0 : dialogNewMessagesCount

                    this.store.dispatch(
                        addDialogMessages({
                            receiverID,
                            messages: [message],
                        })
                    )

                    this.store.dispatch(
                        updateDialogLastMessage({
                            receiverID,
                            lastMessage: message.message,
                            createdAt: this.dateService.now(),
                        })
                    )

                    this.scrollService.emitNewMessage(NEW_MESSAGE_START)

                    if (message.senderID === receiverID) {
                        this.store.dispatch(
                            updateDialogNewMessagesCount({
                                receiverID,
                                newMessagesCount: dlgNewMessagesCount + 1,
                            })
                        )
                    }
                })
            )
            .subscribe()

        this.sub = this.wsService
            .fromEvent<void>(WsEvents.user.allMessagesRead)
            .pipe(
                switchMap(() => this.store.pipe(select(selectActiveReceiverID), first())),
                tap((receiverID) => {
                    if (receiverID !== null) {
                        this.store.dispatch(markDialogMessagesAsRead({ receiverID }))

                        if (!this.scrollService.getAllowScrollBottom()) {
                            this.scrollService.emitAllMessagesRead()
                        }
                    }
                })
            )
            .subscribe()

        this.sub = this.wsService
            .fromEvent<IDialog>(WsEvents.user.newDialog)
            .pipe(
                tap((newDialog) => {
                    this.store.dispatch(addDialogs({ dialogs: [newDialog] }))
                })
            )
            .subscribe()
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
