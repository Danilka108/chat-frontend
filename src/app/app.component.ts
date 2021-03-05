import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { SessionErrorService } from './session/session-error.service'
import { SESSION_ERROR_MESSAGE } from './session/session.constants'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
    subscription = new Subscription()

    constructor(private readonly snackbar: MatSnackBar, private readonly sessionErrorService: SessionErrorService) {}

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    ngOnInit() {
        this.sessionErrorService
            .get()
            .pipe(
                map(() => {
                    this.snackbar.open(SESSION_ERROR_MESSAGE, 'ok', {
                        duration: 2000,
                    })
                })
            )
            .subscribe()
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
