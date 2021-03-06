import { Component, HostListener, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, combineLatest, forkJoin, from, Observable, of, Subscription } from 'rxjs'
import { filter, first, map, observeOn, startWith, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { StorageService } from 'src/app/storage/storage.service'
import { updateUserName } from 'src/app/store/actions/auth.actions'
import {
    addDialogMessages,
    addDialogs,
    increaseDialogNewMessagesCount,
    markDialogMessageAsRead,
    markDialogMessagesAsRead,
    toggleDarkTheme,
    updateActiveReceiverID,
    updateDialogConnectionStatus,
    updateDialogLastMessage,
    updateDialogMessages,
} from 'src/app/store/actions/main.actions'
import { selectConnectionError, selectUserID } from 'src/app/store/selectors/auth.selectors'
import {
    selectActiveReceiverID,
    selectDialogMessages,
    selectDialogs,
    selectIsDarkTheme,
    selectRequestLoading,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { WsEvents } from 'src/app/ws/ws.events'
import { WsService } from 'src/app/ws/ws.service'
import { NoConnectionComponent } from '../../components/no-connection/no-connection.component'
import { TABLET_WIDTH_BREAK_POINT } from '../../dialogs.constants'
import { IDialog } from '../../interface/dialog.interface'
import { IMessage } from '../../interface/message.interface'
import { HttpService } from '../../services/http.service'
import { ScrollService } from '../../services/scroll.service'
import { SidebarService } from '../../services/sidebar.service'

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
        private readonly httpService: HttpService,
        private readonly storageService: StorageService,
        private readonly sidebarService: SidebarService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        if (window.innerWidth > TABLET_WIDTH_BREAK_POINT) {
            this.sidebarService.closeSidebar()
        }
    }

    ngOnInit(): void {
        this.requestLoading$ = this.store.pipe(select(selectRequestLoading), observeOn(asyncScheduler))

        const isDarkTheme = this.storageService.getIsDarkTheme()
        if (isDarkTheme) {
            this.store.dispatch(toggleDarkTheme())
        }

        this.sub = this.store
            .pipe(
                select(selectIsDarkTheme),
                tap((isDarkTheme) => {
                    if (isDarkTheme) {
                        this.storageService.setIsDarkTheme(true)
                        document.body.classList.add('dark-theme')
                    } else {
                        this.storageService.setIsDarkTheme(false)
                        document.body.classList.remove('dark-theme')
                    }
                })
            )
            .subscribe()

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
                switchMap(() => this.route.url),
                map((url) => {
                    if (url.length >= 1) {
                        return url[url.length - 1].path
                    }

                    return null
                }),
                switchMap((url) =>
                    combineLatest([
                        of(url),
                        this.store.pipe(
                            select(selectDialogs),
                            first(),
                            map((dialogs) => (dialogs === null ? [] : dialogs.map((dialog) => dialog.receiverID)))
                        ),
                    ])
                ),
                switchMap(([url, dialogsID]) => {
                    if (url === null) return of(null)

                    const id = Number(url)

                    if (isNaN(id)) return of(null)

                    this.store.dispatch(updateActiveReceiverID({ activeReceiverID: id }))

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

                    this.scrollService.emitNewMessage()

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
                switchMap((newDialog) =>
                    forkJoin({
                        newDialog: of(newDialog),
                        activeReceiverID: this.store.pipe(select(selectActiveReceiverID), first()),
                    })
                ),
                switchMap(({ newDialog, activeReceiverID }) =>
                    forkJoin({
                        newDialog: of(newDialog),
                        activeReceiverID: of(activeReceiverID),
                        storeMessages:
                            activeReceiverID === null
                                ? of(null)
                                : this.store.pipe(
                                      select(selectDialogMessages, { receiverID: activeReceiverID }),
                                      first()
                                  ),
                    })
                ),
                tap(({ newDialog, activeReceiverID, storeMessages }) => {
                    this.store.dispatch(addDialogs({ dialogs: [newDialog] }))

                    if (newDialog.receiverID === activeReceiverID && storeMessages === null) {
                        this.store.dispatch(updateDialogMessages({ receiverID: activeReceiverID, messages: [] }))
                    }
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
