import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { RippleAnimationConfig } from '@angular/material/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { selectIsDarkTheme } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'

@Component({
    selector: 'app-dialogs-item',
    templateUrl: './dialogs-item.component.html',
    styleUrls: ['./dialogs-item.component.scss'],
})
export class DialogsItemComponent implements OnInit {
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() click = new EventEmitter<undefined>()

    @Input() active!: boolean
    @Input() receiver!: string
    @Input() date!: string
    @Input() message!: string
    @Input() notReadedMessagesCount!: number
    @Input() receiverID!: number
    @Input() connectionStatus!: 'offline' | 'online'

    isDarkTheme$!: Observable<boolean>

    RippleConfig: RippleAnimationConfig = {
        enterDuration: 700,
        exitDuration: 1000,
    }

    constructor(private readonly store: Store<AppState>) {}

    ngOnInit(): void {
        this.isDarkTheme$ = this.store.select(selectIsDarkTheme)
    }

    onClick(): void {
        this.click.emit()
    }
}
