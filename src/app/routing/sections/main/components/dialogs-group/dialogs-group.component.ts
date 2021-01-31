import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core'
import { IDialog } from '../../interface/dialog.interface'
import { ActivatedRoute, Router } from '@angular/router'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'
import { Store } from 'src/app/store/core/store'
import { IAppState } from 'src/app/store/states/app.state'
import { getActiveReceiverID, getDialogs } from 'src/app/store/selectors/main.selectors'
import { updateActiveReceiverID } from 'src/app/store/actions/main.actions'
import { IScrollbarCfg } from 'src/app/scrollbar/interfaces/config.interface'

@Component({
    selector: 'app-main-dialogs-group',
    templateUrl: './dialogs-group.component.html',
    styleUrls: ['./dialogs-group.component.scss'],
})
export class DialogsGroupComponent implements OnInit, OnDestroy {
    dialogs$!: Observable<IDialog[]>
    activeReceiverID$!: Observable<number | null>
    subs!: Subscription

    @HostBinding('class.small') isSmallSize = false
    smallSizeMax = 800

    scrollbarConfig: IScrollbarCfg = {
        isScroll: {
            horizontal: false,
        },
        trackThickness: {
            vertical: {
                unit: 'rem',
                value: 0.3,
            },
        },
    }

    constructor(
        private readonly store: Store<IAppState>,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly dateService: DateService
    ) {}

    ngOnInit() {
        this.activeReceiverID$ = this.store.select(getActiveReceiverID())

        this.dialogs$ = this.store.select(getDialogs()).pipe(
            map((dialogs) => {
                return dialogs.sort((a, b) => this.dateService.compareDates(a.createdAt, b.createdAt))
            })
        )

        this.subs = this.route.params.subscribe((params) => {
            const id = Number(params['id'])
            if (!isNaN(id)) this.store.dispatch(updateActiveReceiverID(id))
            else this.store.dispatch(updateActiveReceiverID(null))
        })

        this.onResize()
    }

    ngOnDestroy() {
        if (this.subs) this.subs.unsubscribe()
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
