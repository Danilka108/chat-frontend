import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Observable, Subject, Subscription } from 'rxjs'
import { delay, startWith } from 'rxjs/operators'
import { addDialogs } from 'src/app/store/actions/main.actions'
import { Store } from 'src/app/store/core/store'
import { getConnectionError } from 'src/app/store/selectors/auth.selectors'
import { getRequestLoading } from 'src/app/store/selectors/main.selectors'
import { IAppState } from 'src/app/store/states/app.state'
import { NoConnectionComponent } from '../../components/no-connection/no-connection.component'
import { MainSectionHttpService } from '../../services/main-section-http.service'

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
        private readonly dialog: MatDialog
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
    }

    onTopReached() {
        this.topReachedEvent.next()
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
