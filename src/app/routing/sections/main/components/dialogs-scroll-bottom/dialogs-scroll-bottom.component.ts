import { AfterViewInit, Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ScrollService, SCROLL_BOTTOM_UPDATE_CONTENT } from '../../services/scroll.service'

@Component({
    selector: 'app-main-dialogs-scroll-bottom',
    templateUrl: './dialogs-scroll-bottom.component.html',
    styleUrls: ['./dialogs-scroll-bottom.component.scss'],
})
export class DialogsScrollBottomComponent implements AfterViewInit, OnDestroy {
    isViewed = true
    isDisabled = false
    sub = new Subscription()

    constructor(private readonly scrollService: ScrollService) {}

    ngAfterViewInit() {
        this.sub.add(
            this.scrollService
                .getIsViewedScrollBottom()
                .pipe(
                    tap((isViewed) =>
                        setTimeout(() => {
                            this.isViewed = isViewed
                            this.isDisabled = !isViewed
                        })
                    )
                )
                .subscribe()
        )
    }

    onClick() {
        this.scrollService.emitScrollBottom(SCROLL_BOTTOM_UPDATE_CONTENT)
        setTimeout(() => {
            this.isDisabled = true
            this.isViewed = false
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }
}
