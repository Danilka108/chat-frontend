import { Component, OnInit } from '@angular/core'
import { authSignInPath } from 'src/app/routes.constants'

@Component({
    selector: 'app-reset-password-check-email',
    templateUrl: './reset-password-check-email.component.html',
    styleUrls: ['./reset-password-check-email.component.scss'],
})
export class ResetPasswordCheckEmailComponent {
    redirectLink = authSignInPath.full

    constructor() {}
}
