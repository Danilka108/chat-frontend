import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-auth-error',
    templateUrl: './auth-error.component.html',
    styleUrls: ['./auth-error.component.scss'],
})
export class AuthErrorComponent {
    @Input() error!: boolean

    constructor() {}
}
