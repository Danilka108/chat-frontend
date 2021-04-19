import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { BehaviorSubject, forkJoin, Observable, of, Subscription } from 'rxjs'
import { first, map, switchMap, tap } from 'rxjs/operators'
import {
    selectActiveReceiverID,
    selectDialog,
    selectDialogConnectionStatus,
    selectReconnectionLoading,
} from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { MainHttpService } from '../../services/main-http.service'

@Component({
    selector: 'app-dialogs-info',
    templateUrl: './dialogs-info.component.html',
    styleUrls: ['./dialogs-info.component.scss'],
})
export class DialogsInfoComponent implements OnInit, OnDestroy {
    @Input() isOnlyLoading = false

    name = new BehaviorSubject<string>('')
    name$ = this.name.asObservable()
    connectionStatus$: Observable<'online' | 'offline' | null> = of(null)

    isLoading$!: Observable<boolean>

    subscription = new Subscription()

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    constructor(private readonly store: Store<AppState>, private readonly httpService: MainHttpService) {}

    ngOnInit(): void {
        this.isLoading$ = this.store.pipe(select(selectReconnectionLoading))

        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                tap(() => {
                    this.name.next('')
                }),
                switchMap((receiverID) =>
                    forkJoin({
                        receiverID: of(receiverID),
                        dialog:
                            receiverID === null
                                ? of(null)
                                : this.store.pipe(select(selectDialog, { receiverID }), first()),
                    })
                ),
                switchMap(({ dialog, receiverID }) => {
                    if (dialog === null && receiverID !== null) {
                        return this.httpService.getUserName(receiverID)
                    }

                    return dialog === null ? of(null) : of(dialog.receiverName)
                }),
                map((userName) => {
                    return userName === null ? '' : userName
                }),
                tap((userName) => {
                    this.name.next(userName)
                })
            )
            .subscribe()

        this.connectionStatus$ = this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((receiverID) =>
                receiverID === null ? of(null) : this.store.pipe(select(selectDialogConnectionStatus, { receiverID }))
            )
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
