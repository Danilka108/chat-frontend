import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Injectable()
export class SidebarService {
    private readonly isOpenSidebar = new Subject<boolean>()

    openSidebar(): void {
        this.isOpenSidebar.next(true)
    }

    closeSidebar(): void {
        this.isOpenSidebar.next(false)
    }

    getIsOpenSidebar(): Observable<boolean> {
        return this.isOpenSidebar.asObservable()
    }
}
