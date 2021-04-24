import { Component, ViewChild } from '@angular/core'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { Store } from '@ngrx/store'
import { SessionService } from 'src/app/session/session.service'
import { toggleDarkTheme } from 'src/app/store/actions/main.actions'
import { AppState } from 'src/app/store/state/app.state'

@Component({
    selector: 'app-dialogs-menu',
    templateUrl: './dialogs-menu.component.html',
    styleUrls: ['./dialogs-menu.component.scss'],
})
export class DialogsMenuComponent {
    @ViewChild('slideToggle') slideToggle!: MatSlideToggle

    constructor(private readonly store: Store<AppState>, private readonly sessionService: SessionService) {}

    logout(): void {
        this.sessionService.remove(false)
    }

    toggleDarkMode(): void {
        this.store.dispatch(toggleDarkTheme())
    }
}
