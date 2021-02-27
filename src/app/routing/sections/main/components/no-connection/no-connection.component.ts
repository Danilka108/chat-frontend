import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
    selector: 'app-main-no-connection',
    templateUrl: './no-connection.component.html',
    styleUrls: ['./no-connection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoConnectionComponent {
    refresh() {
        window.location.reload()
    }
}
