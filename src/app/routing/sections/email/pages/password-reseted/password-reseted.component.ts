import { ChangeDetectionStrategy, Component } from '@angular/core'
@Component({
    selector: 'app-password-reseted',
    templateUrl: './password-reseted.component.html',
    styleUrls: ['./password-reseted.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush    
})
export class PasswordResetedComponent {
    redirectLink = ''

    constructor() {}
}
