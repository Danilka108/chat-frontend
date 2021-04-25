import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle'
import { select, Store } from '@ngrx/store'
import { Subscription } from 'rxjs'
import { tap } from 'rxjs/operators'
import { SessionService } from 'src/app/session/session.service'
import { toggleDarkTheme } from 'src/app/store/actions/main.actions'
import { selectIsDarkTheme } from 'src/app/store/selectors/main.selectors'
import { AppState } from 'src/app/store/state/app.state'

@Component({
    selector: 'app-dialogs-menu',
    templateUrl: './dialogs-menu.component.html',
    styleUrls: ['./dialogs-menu.component.scss'],
})
export class DialogsMenuComponent implements AfterViewInit, OnDestroy {
    @ViewChild('slideToggle') slideToggle!: MatSlideToggle

    isChecked = false

    subscription = new Subscription()

    constructor(
        private readonly store: Store<AppState>,
        private readonly sessionService: SessionService,
        private readonly changeDetector: ChangeDetectorRef
    ) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngAfterViewInit(): void {
        this.sub = this.slideToggle.change
            .pipe(
                tap((slideToggleChange: MatSlideToggleChange) => {
                    this.isChecked = slideToggleChange.checked
                    this.store.dispatch(toggleDarkTheme())
                })
            )
            .subscribe()

        this.sub = this.store
            .pipe(
                select(selectIsDarkTheme),
                tap((isDarkTheme) => {
                    if (isDarkTheme !== this.isChecked) {
                        this.slideToggle.toggle()
                        this.changeDetector.detectChanges()
                    }
                })
            )
            .subscribe()
    }

    logout(): void {
        this.sessionService.remove(false)
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
