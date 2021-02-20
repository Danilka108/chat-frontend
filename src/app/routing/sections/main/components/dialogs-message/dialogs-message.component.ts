import { Component, HostBinding, Input } from '@angular/core'
import { DateService } from 'src/app/common/date.service'

@Component({
    selector: 'app-main-dialogs-message',
    templateUrl: './dialogs-message.component.html',
    styleUrls: ['./dialogs-message.component.scss'],
})
export class DialogsMessageComponent {
    @Input() @HostBinding('class.own-msg') isOwnMsg!: boolean
    @Input() @HostBinding('class.last-in-group') isLastInGroup!: boolean
    @Input() message!: string
    @Input() date!: string
    @Input() wrapperWidth!: number

    wrapperWidthFactor = 0.5

    constructor(private readonly dateService: DateService) {}

    parseDate(date: string) {
        return this.dateService.parseDateOnlyTime(date)
    }
}
