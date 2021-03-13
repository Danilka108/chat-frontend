import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { DateService } from 'src/app/common/date.service'

@Component({
    selector: 'app-main-dialogs-separator',
    templateUrl: './dialogs-separator.component.html',
    styleUrls: ['./dialogs-separator.component.scss'],
})
export class DialogsSeparatorComponent {
    @Input() date!: string

    constructor(private readonly dateService: DateService) {}

    getDate() {
        return this.dateService.parseDateWords(this.date)
    }
}
