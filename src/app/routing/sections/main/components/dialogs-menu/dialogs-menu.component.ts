import { Component } from '@angular/core'
import { SessionService } from 'src/app/session/session.service'

@Component({
    selector: 'app-dialogs-menu',
    templateUrl: './dialogs-menu.component.html',
    styleUrls: ['./dialogs-menu.component.scss'],
})
export class DialogsMenuComponent {
    constructor(private readonly sessionService: SessionService) {}

    logout(): void {
        this.sessionService.remove(false)
    }
}
