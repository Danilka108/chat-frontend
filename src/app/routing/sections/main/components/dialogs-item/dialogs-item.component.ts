import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-main-dialogs-item',
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

    onClick(): void {
        this.click.emit()
    }
}
