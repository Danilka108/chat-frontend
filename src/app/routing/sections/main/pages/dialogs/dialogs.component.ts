import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { asyncScheduler, combineLatest, Observable, of, Subscription } from 'rxjs'
import { delay, filter, map, observeOn, skipWhile, startWith, switchMap, tap } from 'rxjs/operators'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { updateActiveReceiverID } from 'src/app/store/actions/main.actions'
import { selectConnectionError } from 'src/app/store/selectors/auth.selectors'
import { selectActiveReceiverID, selectDialogs, selectRequestLoading } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
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

    constructor(
        private readonly store: Store<AppState>,
        private readonly dialog: MatDialog,
        private readonly route: ActivatedRoute,
        private readonly router: Router
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
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
