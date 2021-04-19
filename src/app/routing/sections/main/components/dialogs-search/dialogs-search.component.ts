import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { from, Observable, of, Subscription } from 'rxjs'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'
import { ISearchUser } from '../../interface/search-user.interface'
import { SearchService } from '../../services/search.service'
import { SMALL_SIZE_MAX_WIDTH } from '../dialogs-group/dialogs-group.component'

@Component({
    selector: 'app-dialogs-search',
    templateUrl: './dialogs-search.component.html',
    styleUrls: ['./dialogs-search.component.scss'],
})
export class DialogsSearchComponent implements OnInit {
    isSmallSize = false
    searchData$: Observable<ISearchUser[]> = of([])

    subscription = new Subscription()

    constructor(private readonly router: Router, private readonly searchService: SearchService) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit(): void {
        this.onResize()

        this.searchData$ = this.searchService.getSearchData()
    }

    @HostListener('window:resize')
    onResize(): void {
        if (window.innerWidth <= SMALL_SIZE_MAX_WIDTH) {
            this.isSmallSize = true
        } else {
            this.isSmallSize = false
        }
    }

    onClick(userID: number): void {
        this.sub = from(this.router.navigate([mainSectionDialogsPath.full, userID])).subscribe()
    }
}
