import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { RippleAnimationConfig } from '@angular/material/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { selectIsDarkTheme } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'
import { SearchService } from '../../services/search.service'

@Component({
    selector: 'app-dialogs-search-item',
    templateUrl: './dialogs-search-item.component.html',
    styleUrls: ['./dialogs-search-item.component.scss'],
})
export class DialogsSearchItemComponent implements OnInit {
    @Input() isSmallSize!: boolean
    @Input() name!: string
    @Input() userID!: number
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() redirect = new EventEmitter<number>()

    RippleConfig: RippleAnimationConfig = {
        enterDuration: 700,
        exitDuration: 1000,
    }

    isDarkTheme$!: Observable<boolean>

    constructor(private readonly searchService: SearchService, private readonly store: Store<AppState>) {}

    ngOnInit(): void {
        this.isDarkTheme$ = this.store.select(selectIsDarkTheme)
    }

    onClick(): void {
        this.searchService.emitClear()
        this.redirect.emit(this.userID)
    }
}
