import { Component, Input } from '@angular/core'
import { IMessagesSection, IMessagesSectionBySender } from '../../interface/message.interface'

@Component({
    selector: 'app-dialogs-messages-section',
    templateUrl: './dialogs-messages-section.component.html',
    styleUrls: ['./dialogs-messages-section.component.scss'],
})
export class DialogsMessagesSectionComponent {
    @Input() sectionByDate!: IMessagesSection

    sectionBySenderIdentity(_: number, item: IMessagesSectionBySender): number {
        return item.id
    }
}
