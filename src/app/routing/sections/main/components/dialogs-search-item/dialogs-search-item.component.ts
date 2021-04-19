import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RippleAnimationConfig } from '@angular/material/core'
import { SearchService } from '../../services/search.service'

@Component({
    selector: 'app-dialogs-search-item',
    templateUrl: './dialogs-search-item.component.html',
    styleUrls: ['./dialogs-search-item.component.scss'],
})
export class DialogsSearchItemComponent {
    @Input() isSmallSize!: boolean
    @Input() name!: string
    @Input() userID!: number
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() redirect = new EventEmitter<number>()

    RippleConfig: RippleAnimationConfig = {
        enterDuration: 700,
        exitDuration: 1000,
    }

    constructor(private readonly searchService: SearchService) {}

    onClick(): void {
        this.searchService.emitClear()
        this.redirect.emit(this.userID)
    }
}
