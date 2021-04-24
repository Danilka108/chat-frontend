import { Component, Input, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { DateService } from 'src/app/common/date.service'
import { selectIsDarkTheme } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'

@Component({
    selector: 'app-dialogs-separator',
    templateUrl: './dialogs-separator.component.html',
    styleUrls: ['./dialogs-separator.component.scss'],
})
export class DialogsSeparatorComponent implements OnInit {
    @Input() date!: string
    isDarkTheme$!: Observable<boolean>

    constructor(private readonly store: Store<AppState>, private readonly dateService: DateService) {}

    ngOnInit(): void {
        this.isDarkTheme$ = this.store.select(selectIsDarkTheme)
    }

    getDate(): string {
        return this.dateService.parseDateWords(this.date)
    }
}
