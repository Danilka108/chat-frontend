import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, combineLatest, forkJoin, from, Observable, of, Subscription } from 'rxjs'
import { filter, first, map, observeOn, skipWhile, startWith, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { updateUserName } from 'src/app/store/actions/auth.actions'
import {
    addDialogMessages,
    addDialogs,
    increaseDialogNewMessagesCount,
    markDialogMessageAsRead,
    markDialogMessagesAsRead,
    updateActiveReceiverID,
    updateDialogConnectionStatus,
    updateDialogLastMessage,
} from 'src/app/store/actions/main.actions'
import { selectConnectionError, selectUserID } from 'src/app/store/selectors/auth.selectors'
import { selectDialogMessages, selectDialogs, selectRequestLoading } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { WsEvents } from 'src/app/ws/ws.events'
import { WsService } from 'src/app/ws/ws.service'
import { NoConnectionComponent } from '../../components/no-connection/no-connection.component'
import { IDialog } from '../../interface/dialog.interface'
import { IMessage } from '../../interface/message.interface'
import { MainHttpService } from '../../services/main-http.service'
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
        private readonly scrollService: ScrollService,
        private readonly httpService: MainHttpService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit(): void {
        this.requestLoading$ = this.store.pipe(select(selectRequestLoading), observeOn(asyncScheduler))

        this.sub = this.store
            .pipe(
                select(selectUserID),
                switchMap((userID) => (userID === null ? of(null) : this.httpService.getUserName(userID))),
                tap((userName) => {
                    if (userName !== null) {
                        this.store.dispatch(updateUserName({ userName }))
                    }
                })
            )
            .subscribe()

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
                            first(),
                            map((dialogs) => (dialogs === null ? [] : dialogs.map((dialog) => dialog.receiverID)))
                        ),
                    ])
                ),
                switchMap((result) => {
                    const [params, dialogsID] = result

                    if (params === null) return of(null)

                    const id = Number(params['id'])

                    if (isNaN(id)) return of(null)

                    if (!dialogsID.includes(id)) {
                        return forkJoin({
                            id: of(id),
                            isExistUser: this.httpService.getIsExistUser(id).pipe(first()),
                        })
                    }

                    return forkJoin({
                        id: of(id),
                        isExistUser: of(true),
                    })
                }),
                switchMap((result) => {
                    if (result === null) {
                        this.store.dispatch(updateActiveReceiverID({ activeReceiverID: null }))
                        return from(this.router.navigateByUrl(mainSectionDialogsPath.full))
                    }

                    if (!result.isExistUser) {
                        this.store.dispatch(updateActiveReceiverID({ activeReceiverID: null }))
                        return from(this.router.navigateByUrl(mainSectionDialogsPath.full))
                    }

                    this.store.dispatch(updateActiveReceiverID({ activeReceiverID: result.id }))
                    return of()
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
                        dialogMessages: this.store.pipe(select(selectDialogMessages, { receiverID }), first()),
                    })
                }),
                tap(({ message, receiverID, dialogMessages }) => {
                    if (dialogMessages !== null) {
                        this.store.dispatch(
                            addDialogMessages({
                                receiverID,
                                messages: [message],
                            })
                        )
                    }

                    this.store.dispatch(
                        updateDialogLastMessage({
                            receiverID,
                            lastMessage: message.message,
                            createdAt: this.dateService.now(),
                        })
                    )

                    this.scrollService.emitNewMessage(NEW_MESSAGE_START)

                    if (message.senderID === receiverID && message.senderID !== message.receiverID) {
                        this.store.dispatch(increaseDialogNewMessagesCount({ receiverID }))
                    }
                })
            )
            .subscribe()

        this.sub = this.wsService
            .fromEvent<number>(WsEvents.user.allMessagesRead)
            .pipe(
                tap((receiverID) => {
                    if (receiverID !== null) {
                        this.store.dispatch(markDialogMessagesAsRead({ receiverID }))
                        this.scrollService.emitMessagesRead()
                    }
                })
            )
            .subscribe()

        this.sub = this.wsService
            .fromEvent<{
                receiverID: number
                messageID: number
            }>(WsEvents.user.messageRead)
            .pipe(
                tap(({ receiverID, messageID }) => {
                    this.store.dispatch(markDialogMessageAsRead({ receiverID, messageID }))
                    this.scrollService.emitMessagesRead()
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

        this.sub = this.wsService
            .fromEvent<{
                receiverID: number
                connectionStatus: 'online' | 'offline'
            }>(WsEvents.user.connectionStatus)
            .pipe(
                tap(({ connectionStatus, receiverID }) => {
                    this.store.dispatch(updateDialogConnectionStatus({ receiverID, connectionStatus }))
                })
            )
            .subscribe()
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
