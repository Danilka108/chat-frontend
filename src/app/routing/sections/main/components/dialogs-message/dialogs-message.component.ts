import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core'
import { DateService } from 'src/app/common/date.service'

@Component({
    selector: 'app-main-dialogs-message',
    templateUrl: './dialogs-message.component.html',
    styleUrls: ['./dialogs-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsMessageComponent implements OnInit {
    @Input() @HostBinding('class.own-msg') isOwnMsg!: boolean
    @Input() @HostBinding('class.last-in-group') isLastInGroup!: boolean
    @Input() message!: string
    @Input() date!: string
    @Input() wrapperWidth!: number | null
    @Input() isReaded!: boolean
    @Input() name!: string | null

    wrapperWidthFactor = 0.5

    constructor(private readonly dateService: DateService) {}

    ngOnInit() {}

    parseDate(date: string) {
        return this.dateService.parseDate(date)
    }
}
