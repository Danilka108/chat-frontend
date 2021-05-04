import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { startWith, tap } from 'rxjs/operators'
import { selectActiveReceiverID } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { SearchService } from '../../services/search.service'
import { SidebarService } from '../../services/sidebar.service'

@Component({
    selector: 'app-dialogs-sidebar',
    templateUrl: './dialogs-sidebar.component.html',
    styleUrls: ['./dialogs-sidebar.component.scss'],
})
export class DialogsSidebarComponent implements OnInit, OnDestroy {
    @HostBinding('class.open') isOpenSidebar = false
    @HostBinding('class.closed') isClosedSidebar = false
    @HostBinding('class.disable-toggle') isDisableToggle = true

    isSearchActive$!: Observable<boolean>

    subscription = new Subscription()

    constructor(
        private readonly searchService: SearchService,
        private readonly sidebarService: SidebarService,
        private readonly store: Store<AppState>
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit(): void {
        this.sub = this.store
            .pipe(
                select(selectActiveReceiverID),
                tap((activeReceiverID) => {
                    this.isDisableToggle = activeReceiverID === null
                })
            )
            .subscribe()

        this.sub = this.sidebarService
            .getIsOpenSidebar()
            .pipe(
                tap((isOpenSidebar) => {
                    this.isOpenSidebar = isOpenSidebar
                    this.isClosedSidebar = !isOpenSidebar
                })
            )
            .subscribe()

        this.isSearchActive$ = this.searchService.getIsView().pipe(startWith(false))
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
