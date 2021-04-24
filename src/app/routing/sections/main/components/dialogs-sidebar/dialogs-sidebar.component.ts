import { Component, HostBinding, HostListener, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { SearchService } from '../../services/search.service'
import { SMALL_SIZE_MAX_WIDTH } from '../dialogs-group/dialogs-group.component'

@Component({
    selector: 'app-dialogs-sidebar',
    templateUrl: './dialogs-sidebar.component.html',
    styleUrls: ['./dialogs-sidebar.component.scss'],
})
export class DialogsSidebarComponent implements OnInit {
    @HostBinding('class.small') isSmallSize = false

    isSearchActive$!: Observable<boolean>

    constructor(private readonly searchService: SearchService) {}

    ngOnInit(): void {
        this.onResize()

        this.isSearchActive$ = this.searchService.getIsView().pipe(startWith(false))
    }

    @HostListener('window:resize')
    onResize(): void {
        if (window.innerWidth <= SMALL_SIZE_MAX_WIDTH) {
            this.isSmallSize = true
        } else {
            this.isSmallSize = false
        }
    }
}
