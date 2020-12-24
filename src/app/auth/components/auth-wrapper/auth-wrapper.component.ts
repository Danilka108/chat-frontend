import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
    selector: 'app-auth-wrapper',
    templateUrl: './auth-wrapper.component.html',
    styleUrls: ['./auth-wrapper.component.scss'],
})
export class AuthWrapperComponent {
    @Input() formGroup!: FormGroup
    @Input() onSubmit!: () => void

    constructor() {}
}
