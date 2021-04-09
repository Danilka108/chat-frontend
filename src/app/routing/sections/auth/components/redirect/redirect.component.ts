import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-auth-redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent {
    @Input() link!: string
}
