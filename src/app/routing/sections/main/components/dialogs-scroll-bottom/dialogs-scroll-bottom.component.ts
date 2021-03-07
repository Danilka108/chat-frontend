import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { ScrollBottomService } from '../../services/scroll-bottom.service'

@Component({
    selector: 'app-main-dialogs-scroll-bottom',
    templateUrl: './dialogs-scroll-bottom.component.html',
    styleUrls: ['./dialogs-scroll-bottom.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogsScrollBottomComponent implements OnInit, OnDestroy {
    isViewed$!: Observable<boolean>
    isDisabled = false
    sub = new Subscription()

    constructor(private readonly scrollBottomService: ScrollBottomService) {}

    ngOnInit() {
        this.isViewed$ = this.scrollBottomService.getIsViewed()

        this.sub.add(
            this.isViewed$.subscribe((isViewed) => {
                if (isViewed) {
                    // this.isDisabled = false
                }
            })
        )
    }

    onClick() {
        this.scrollBottomService.emitScrollBottom(false)
        this.isDisabled = true
    }

    ngOnDestroy() {
        this.sub.unsubscribe()
    }
}
