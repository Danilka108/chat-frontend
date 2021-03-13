import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
    selector: 'app-wrapper',
    templateUrl: './wrapper.component.html',
    styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent {
    @Input() formGroup!: FormGroup
    @Input() onSubmit!: () => void

    constructor() {}
}
