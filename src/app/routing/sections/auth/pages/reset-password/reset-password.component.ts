import { Component, OnDestroy } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthHttpService } from '../../services/auth-http.service'
import { Router } from '@angular/router'
import { from, of, Subscription } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { authSectionResetPasswordCheckEmailPath } from 'src/app/routing/routing.constants'

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnDestroy {
    formGroup = new FormGroup({
        // eslint-disable-next-line @typescript-eslint/unbound-method
        email: new FormControl(null, Validators.required),
    })

    loading = false

    httpError$ = of(false)

    subs!: Subscription

    constructor(private readonly httpService: AuthHttpService, private readonly router: Router) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(): void {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const req$ = this.httpService.resetPassword(this.formGroup.controls['email'].value)

            this.httpError$ = req$.pipe(
                map(() => false),
                catchError(() => of(true))
            )

            this.subs = req$
                .pipe(
                    switchMap(() => {
                        return from(this.router.navigateByUrl(authSectionResetPasswordCheckEmailPath.full))
                    }),
                    catchError(() => {
                        this.loading = false
                        return of()
                    })
                )
                .subscribe()
        }
    }

    ngOnDestroy(): void {
        if (this.subs) this.subs.unsubscribe()
    }
}
