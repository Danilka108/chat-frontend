import { ChangeDetectionStrategy, Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core'
import { IDialog } from '../../interface/dialog.interface'
import { Router } from '@angular/router'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs'
import { filter, map, switchMap, tap } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { MainSectionHttpService } from '../../services/main-section-http.service'
import { select, Store } from '@ngrx/store'
import { AppState } from 'src/app/store/state/app.state'
import { selectActiveReceiverID, selectDialogs } from 'src/app/store/selectors/main.selectors'
import { addDialogs } from 'src/app/store/actions/main.actions'

const SMALL_SIZE_MAX_WIDTH = 800

@Component({
    selector: 'app-main-dialogs-group',
    templateUrl: './dialogs-group.component.html',
    styleUrls: ['./dialogs-group.component.scss'],
})
export class DialogsGroupComponent implements OnInit, OnDestroy {
    dialogs$!: Observable<IDialog[]>
    activeReceiverID$!: Observable<number | null>
    subscription = new Subscription()

    @HostBinding('class.small') isSmallSize = false
    @HostBinding('class.scrollbar') isScrollable = true
    smallSizeMax = SMALL_SIZE_MAX_WIDTH

    constructor(
        private readonly store: Store<AppState>,
        private readonly router: Router,
        private readonly dateService: DateService,
        private readonly httpService: MainSectionHttpService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit() {
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

        this.onResize()
    }

    itemIdentity(_: any, item: IDialog) {
        return item.receiverID
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    @HostListener('window:resize')
    onResize() {
        if (window.innerWidth <= this.smallSizeMax) {
            this.isSmallSize = true
        } else {
            this.isSmallSize = false
        }
    }

    parseDate(d: string) {
        return this.dateService.parseDate(d)
    }

    onClick(receiverID: number) {
        this.router.navigate([mainSectionDialogsPath.full, receiverID])
    }
}
