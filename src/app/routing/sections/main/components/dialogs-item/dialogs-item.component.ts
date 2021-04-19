import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RippleAnimationConfig } from '@angular/material/core'

@Component({
    selector: 'app-dialogs-item',
    templateUrl: './dialogs-item.component.html',
    styleUrls: ['./dialogs-item.component.scss'],
})
export class DialogsItemComponent {
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() click = new EventEmitter<undefined>()

    @Input() active!: boolean
    @Input() receiver!: string
    @Input() date!: string
    @Input() message!: string
    @Input() isSmallSize!: boolean
    @Input() notReadedMessagesCount!: number
    @Input() receiverID!: number
    @Input() connectionStatus!: 'offline' | 'online'

    RippleConfig: RippleAnimationConfig = {
        enterDuration: 700,
        exitDuration: 1000,
    }

    onClick(): void {
        this.click.emit()
    }
}
