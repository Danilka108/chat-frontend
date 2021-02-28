import { ChangeDetectionStrategy, Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core'
import { IDialog } from '../../interface/dialog.interface'
import { Router } from '@angular/router'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { Observable, Subscription } from 'rxjs'
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsGroupComponent implements OnInit, OnDestroy {
    dialogs$!: Observable<IDialog[]>
    activeReceiverID$!: Observable<number | null>
    sub!: Subscription

    @HostBinding('class.small') isSmallSize = false
    smallSizeMax = SMALL_SIZE_MAX_WIDTH

    constructor(
        private readonly store: Store<AppState>,
        private readonly router: Router,
        private readonly dateService: DateService,
        private readonly httpService: MainSectionHttpService
    ) {}

    ngOnInit() {
        this.activeReceiverID$ = this.store.select(selectActiveReceiverID)

        this.dialogs$ = this.store.pipe(
            select(selectDialogs),
            map((dialogs) => {
                return dialogs.sort((a, b) => this.dateService.compareDates(a.createdAt, b.createdAt))
            })
        )

        this.sub = this.store
            .pipe(
                select(selectDialogs),
                filter((dialogs) => {
                    return dialogs.length === 0
                }),
                switchMap(() => {
                    return this.httpService.getDialogs()
                }),
                tap((dialogs) => {
                    this.store.dispatch(addDialogs({ dialogs }))
                })
            )
            .subscribe()

        this.onResize()
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe()
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
