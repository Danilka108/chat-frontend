import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core'
import { IDialog } from '../../interface/dialog.interface'
import { MainStore } from 'src/app/store/main/main.store'
import { ActivatedRoute, Router } from '@angular/router'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { DateService } from 'src/app/common/date.service'

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

    constructor(
        private readonly mainStore: MainStore,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly dateService: DateService
    ) {}

    ngOnInit() {
        this.activeReceiverID$ = this.mainStore.getActiveReceiverID$()
        this.dialogs$ = this.mainStore.getDialogs$().pipe(
            map((dialogs) => {
                return dialogs.sort((a, b) => this.dateService.compareDates(a.createdAt, b.createdAt))
            })
        )

        this.subs = this.route.params.subscribe((params) => {
            const id = parseInt(params['id'])
            if (!isNaN(id)) this.mainStore.setActiveReceiverID(id)
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
