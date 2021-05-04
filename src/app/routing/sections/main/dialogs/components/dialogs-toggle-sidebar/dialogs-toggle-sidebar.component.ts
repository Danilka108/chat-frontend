import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { SidebarService } from '../../services/sidebar.service'

@Component({
    selector: 'app-dialogs-toggle-sidebar',
    templateUrl: './dialogs-toggle-sidebar.component.html',
    styleUrls: ['./dialogs-toggle-sidebar.component.scss'],
})
export class DialogsToggleSidebarComponent implements OnInit {
    isOpenSidebar$!: Observable<boolean>
    @Input() @HostBinding('class.disable') disable = false

    subscription = new Subscription()

    constructor(private readonly sidebarService: SidebarService) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit(): void {
        this.isOpenSidebar$ = this.sidebarService.getIsOpenSidebar()
    }

    openSidebar(): void {
        this.sidebarService.openSidebar()
    }

    closeSidebar(): void {
        this.sidebarService.closeSidebar()
    }
}
