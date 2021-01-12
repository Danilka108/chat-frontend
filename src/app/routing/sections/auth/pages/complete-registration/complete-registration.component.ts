import { Component } from '@angular/core'
import { authSignInPath } from 'src/app/routes.constants'

@Component({
    selector: 'app-complete-registration',
    templateUrl: './complete-registration.component.html',
    styleUrls: ['./complete-registration.component.scss'],
})
export class CompleteRegistrationComponent {
    redirectLink = authSignInPath.full

    constructor() {}
}
