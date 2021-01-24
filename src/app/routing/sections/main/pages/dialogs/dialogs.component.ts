import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Observable, Subscription } from 'rxjs'
import { delay, startWith } from 'rxjs/operators'
import { AuthStore } from 'src/app/store/auth/auth.store'
import { addDialogs } from 'src/app/store/main/actions/dialogs.actions'
import { getRequestLoading } from 'src/app/store/main/actions/request-loading.actions'
import { MainStore } from 'src/app/store/main/main.store'
import { NoConnectionComponent } from '../../components/no-connection/no-connection.component'
import { MainSectionHttpService } from '../../main-section-http.service'

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.scss'],
})
export class DialogsComponent implements OnInit, OnDestroy {
    subsReq!: Subscription
    subsNoConnection!: Subscription
    noConnectionDialog: MatDialogRef<NoConnectionComponent> | null = null
    requestLoading$!: Observable<boolean>

    constructor(
        private readonly httpService: MainSectionHttpService,
        private readonly mainStore: MainStore,
        private readonly authStore: AuthStore,
        private readonly dialog: MatDialog,
    ) {}

    ngOnInit() {
        this.requestLoading$ = this.mainStore.select(getRequestLoading()).pipe(startWith(true), delay(0))

        this.subsNoConnection = this.authStore.getConnectionError$().subscribe((isError) => {
            if (!this.noConnectionDialog && isError) {
                this.noConnectionDialog = this.dialog.open(NoConnectionComponent, {
                    closeOnNavigation: true,
                    disableClose: true,
                })
            } else if (this.noConnectionDialog && !isError) {
                this.noConnectionDialog.close()
            }
        })

        this.subsReq = this.httpService.getDialogs().subscribe((dialogs) => {
            this.mainStore.dispatch(addDialogs(...dialogs))
        })
    }

    ngOnDestroy() {
        if (this.subsReq) this.subsReq.unsubscribe()
        if (this.subsNoConnection) this.subsNoConnection.unsubscribe()
    }
}
