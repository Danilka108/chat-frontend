import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, of, Subject, Subscription } from 'rxjs'
import { catchError, delay, skipWhile, startWith, switchMap, tap } from 'rxjs/operators'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { updateActiveReceiverID } from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import { getConnectionError } from 'src/app/store/selectors/auth.selectors'
import { getDialogs, getRequestLoading } from 'src/app/store/selectors/main.selectors'
import { IAppState } from 'src/app/store/states/app.state'
import { NoConnectionComponent } from '../../components/no-connection/no-connection.component'

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.scss'],
})
export class DialogsComponent implements OnInit, OnDestroy {
    noConnectionDialog: MatDialogRef<NoConnectionComponent> | null = null
    requestLoading$!: Observable<boolean>

    subscription = new Subscription()

    topReachedEvent = new Subject<void>()
    topReachedEvent$ = this.topReachedEvent.asObservable()

    constructor(
        private readonly store: Store<IAppState>,
        private readonly dialog: MatDialog,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit() {
        this.requestLoading$ = this.store.select(getRequestLoading()).pipe(startWith(true), delay(0))

        this.sub = this.store.select(getConnectionError()).subscribe((isError) => {
            if (!this.noConnectionDialog && isError) {
                this.noConnectionDialog = this.dialog.open(NoConnectionComponent, {
                    closeOnNavigation: true,
                    disableClose: true,
                })
            } else if (this.noConnectionDialog && !isError) {
                this.noConnectionDialog.close()
            }
        })

        this.sub = this.store
            .select(getDialogs())
            .pipe(
                skipWhile((dialogs) => dialogs.length === 0),
                switchMap(() => this.route.params),
                tap((params) => {
                    console.log(this.store.selectSnapshot(getDialogs()))
                    const id = Number(params['id'])

                    const dialogsIDs = this.store.selectSnapshot(getDialogs()).map((dialog) => dialog.receiverID)

                    if (isNaN(id) || !dialogsIDs.includes(id)) {
                        this.store.dispatch(updateActiveReceiverID(null))
                        this.router.navigateByUrl(mainSectionDialogsPath.full)
                    } else {
                        this.store.dispatch(updateActiveReceiverID(id))
                    }
                }),
                catchError(() => of())
            )
            .subscribe()
    }

    onTopReached() {
        this.topReachedEvent.next()
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
