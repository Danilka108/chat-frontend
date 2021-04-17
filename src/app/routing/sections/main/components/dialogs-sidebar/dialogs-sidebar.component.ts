import { Component, HostBinding, HostListener, OnInit } from '@angular/core'
import { SMALL_SIZE_MAX_WIDTH } from '../dialogs-group/dialogs-group.component'

@Component({
    selector: 'app-main-dialogs-sidebar',
    templateUrl: './dialogs-sidebar.component.html',
    styleUrls: ['./dialogs-sidebar.component.scss'],
})
export class DialogsSidebarComponent implements OnInit {
    @HostBinding('class.small') isSmallSize = false

    ngOnInit(): void {
        this.onResize()
    }

    @HostListener('window:resize')
    onResize(): void {
        if (window.innerWidth <= SMALL_SIZE_MAX_WIDTH) {
            this.isSmallSize = true
        } else {
            this.isSmallSize = false
        }
    }
}
