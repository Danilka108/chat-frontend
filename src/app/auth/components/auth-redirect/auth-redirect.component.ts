import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-auth-redirect',
    templateUrl: './auth-redirect.component.html',
    styleUrls: ['./auth-redirect.component.scss'],
})
export class AuthRedirectComponent {
    @Input() link!: string

    constructor() {}
}
