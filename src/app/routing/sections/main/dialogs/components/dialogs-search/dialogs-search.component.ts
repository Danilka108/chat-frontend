import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { from, Observable, of, Subscription } from 'rxjs'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { ISearchUser } from '../../interface/search-user.interface'
import { SearchService } from '../../services/search.service'
import { SidebarService } from '../../services/sidebar.service'

@Component({
    selector: 'app-dialogs-search',
    templateUrl: './dialogs-search.component.html',
    styleUrls: ['./dialogs-search.component.scss'],
})
export class DialogsSearchComponent implements OnInit {
    isSmallSize = false
    searchData$: Observable<ISearchUser[]> = of([])

    subscription = new Subscription()

    constructor(
        private readonly router: Router,
        private readonly searchService: SearchService,
        private readonly sidebarService: SidebarService
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit(): void {
        this.searchData$ = this.searchService.getSearchData()
    }

    onClick(userID: number): void {
        this.sidebarService.closeSidebar()
        this.sub = from(this.router.navigate([mainSectionDialogsPath.full, userID])).subscribe()
    }
}
