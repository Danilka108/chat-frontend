import { Component } from '@angular/core'
import { authSectionSignInPath } from 'src/app/routing/routing.constants'

@Component({
    selector: 'app-complete-registration',
    templateUrl: './complete-registration.component.html',
    styleUrls: ['./complete-registration.component.scss'],
})
export class CompleteRegistrationComponent {
    redirectLink = authSectionSignInPath.full
}
