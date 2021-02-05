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

@Component({
    selector: 'app-main-dialogs-group',
    templateUrl: './dialogs-group.component.html',
    styleUrls: ['./dialogs-group.component.scss'],
})
export class DialogsGroupComponent implements OnInit, OnDestroy {
    dialogs$!: Observable<IDialog[]>
    activeReceiverID$!: Observable<number | null>
    sub!: Subscription

    @HostBinding('class.small') isSmallSize = false
    smallSizeMax = 800

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

        this.sub = this.route.params.subscribe((params) => {
            const id = Number(params['id'])
            if (!isNaN(id)) this.store.dispatch(updateActiveReceiverID(id))
            else this.store.dispatch(updateActiveReceiverID(null))
        })

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
