import { ChangeDetectionStrategy, Component } from '@angular/core'
import { authSectionSignInPath } from 'src/app/routing/routing.constants'

@Component({
    selector: 'app-reset-password-check-email',
    templateUrl: './reset-password-check-email.component.html',
    styleUrls: ['./reset-password-check-email.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordCheckEmailComponent {
    redirectLink = authSectionSignInPath.full

    constructor() {}
}
