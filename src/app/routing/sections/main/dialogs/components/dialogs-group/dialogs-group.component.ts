import { Component, OnDestroy, OnInit } from '@angular/core'
import { IDialog } from '../../interface/dialog.interface'
import { Router } from '@angular/router'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { from, Observable, Subscription } from 'rxjs'
import { filter, map, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { select, Store } from '@ngrx/store'
import { AppState } from 'src/app/store/state/app.state'
import { selectActiveReceiverID, selectDialogs } from 'src/app/store/selectors/main.selectors'
import { addDialogs } from 'src/app/store/actions/main.actions'
import { SidebarService } from '../../services/sidebar.service'
import { HttpService } from '../../services/http.service'

@Component({
    selector: 'app-dialogs-group',
    templateUrl: './dialogs-group.component.html',
    styleUrls: ['./dialogs-group.component.scss'],
})
export class DialogsGroupComponent implements OnInit, OnDestroy {
    dialogs$!: Observable<IDialog[]>
    activeReceiverID$!: Observable<number | null>
    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly router: Router,
        private readonly dateService: DateService,
        private readonly httpService: HttpService,
        private readonly sidebarService: SidebarService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit(): void {
        this.activeReceiverID$ = this.store.pipe(select(selectActiveReceiverID))

        this.dialogs$ = this.store.pipe(
            select(selectDialogs),
            map((dialogs) => {
                if (dialogs === null) return []

                return dialogs.slice().sort((a, b) => this.dateService.compareDates(a.createdAt, b.createdAt))
            })
        )

        this.sub = this.store
            .pipe(
                select(selectDialogs),
                filter((dialogs) => dialogs === null),
                switchMap(() => this.httpService.getDialogs()),
                tap((dialogs) => {
                    this.store.dispatch(addDialogs({ dialogs }))
                })
            )
            .subscribe()
    }

    itemIdentity(_: unknown, item: IDialog): number {
        return item.receiverID
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }

    parseDate(d: string): string {
        return this.dateService.parseDate(d)
    }

    onClick(receiverID: number): void {
        this.sidebarService.closeSidebar()
        this.sub = from(this.router.navigate([mainSectionDialogsPath.full, receiverID])).subscribe()
    }
}
