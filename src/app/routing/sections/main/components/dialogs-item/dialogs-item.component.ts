import { Component, EventEmitter, Input } from '@angular/core'

@Component({
    selector: 'app-main-dialogs-item',
    templateUrl: './dialogs-item.component.html',
    styleUrls: ['./dialogs-item.component.scss'],
})
export class DialogsItemComponent {
    click = new EventEmitter<null>()

    @Input() active!: boolean
    @Input() receiver!: string
    @Input() date!: string
    @Input() message!: string
    @Input() isSmallSize!: boolean

    rippleColorActive = 'rgba(220, 220, 220, 0.17)'
    rippleColor = ''

    onClick() {
        this.click.emit()
    }
}
