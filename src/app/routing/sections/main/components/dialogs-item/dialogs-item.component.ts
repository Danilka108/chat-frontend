import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core'
import { Router } from '@angular/router'
import { mainSectionDialogsPath } from 'src/app/routing/routing.constants'

@Component({
    selector: 'app-main-dialogs-item',
    templateUrl: './dialogs-item.component.html',
    styleUrls: ['./dialogs-item.component.scss'],
})
export class DialogsItemComponent {
    @Output() click = new EventEmitter<undefined>()

    @Input() active!: boolean
    @Input() receiver!: string
    @Input() date!: string
    @Input() message!: string
    @Input() isSmallSize!: boolean
    @Input() notReadedMessagesCount!: number
    @Input() receiverID!: number

    rippleColorActive = 'rgba(220, 220, 220, 0.17)'
    rippleColor = ''

    onClick() {
        this.click.emit()
    }
}
