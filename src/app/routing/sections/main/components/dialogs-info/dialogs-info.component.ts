import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import {
    selectActiveReceiverID,
    selectDialog,
    selectDialogConnectionStatus,
    selectReconnectionLoading
} from 'src/app/store/selectors/main.selectors';
import { AppState } from 'src/app/store/state/app.state';

@Component({
    selector: 'app-main-dialogs-info',
    templateUrl: './dialogs-info.component.html',
    styleUrls: ['./dialogs-info.component.scss'],
})
export class DialogsInfoComponent implements OnInit, OnDestroy {
    name$!: Observable<string>
    connectionStatus$: Observable<'online' | 'offline'> = of('offline')

    isLoading$!: Observable<boolean>

    subscription = new Subscription()

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    constructor(
        private readonly store: Store<AppState>
    ) {}

    ngOnInit(): void {
        this.isLoading$ = this.store.pipe(
            select(selectReconnectionLoading),
            startWith(false)
        )

        this.name$ = this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((receiverID) => receiverID === null ? of(null) : this.store.pipe(select(selectDialog, { receiverID }))),
            map((dialog) => {
                if (dialog === null) return ''
                return dialog.receiverName
            })
        )

        this.connectionStatus$ = this.store.pipe(
            select(selectActiveReceiverID),
            switchMap((receiverID) =>
                receiverID === null
                ? of(null)
                : this.store.pipe(select(selectDialogConnectionStatus, { receiverID })
            )),
            map((status) => {
                if (status === 'online') return 'online'
                else return 'offline'
            }),
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}