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
import { addDialogs, updateActiveReceiverID } from 'src/app/store/actions/main.actions'
import { MainSectionHttpService } from '../../services/main-section-http.service'

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
        private readonly router: Router,
        private readonly dateService: DateService,
        private readonly httpService: MainSectionHttpService
    ) {}

    ngOnInit() {
        this.activeReceiverID$ = this.store.select(getActiveReceiverID())

        this.dialogs$ = this.store.select(getDialogs()).pipe(
            map((dialogs) => {
                return dialogs.sort((a, b) => this.dateService.compareDates(a.createdAt, b.createdAt))
            })
        )

        this.sub = this.httpService.getDialogs().subscribe((dialogs) => {
            this.store.dispatch(addDialogs(dialogs))
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
