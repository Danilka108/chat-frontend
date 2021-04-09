import { Component, OnDestroy } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { authSectionResetPasswordPath, authSectionSignUpPath } from 'src/app/routing/routing.constants'
import { SessionService } from 'src/app/session/session.service'
import { AuthSectionHttpService } from '../../services/auth-section-http.service'

@Component({
    selector: 'app-auth-sing-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnDestroy {
    passwordHide = true

    formGroup = new FormGroup({
        // eslint-disable-next-line @typescript-eslint/unbound-method
        email: new FormControl(null, [Validators.required]),
        // eslint-disable-next-line @typescript-eslint/unbound-method
        password: new FormControl(null, [Validators.required]),
        rememberMe: new FormControl(true),
    })

    redirectLink = authSectionSignUpPath.full
    resetPasswordLink = authSectionResetPasswordPath.full

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    loading = false

    subs!: Subscription

    constructor(
        private readonly httpService: AuthSectionHttpService,
        private readonly router: Router,
        private readonly sessionService: SessionService
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(): void {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const req$ = this.httpService.signIn({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                email: this.formGroup.controls['email'].value,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                password: this.formGroup.controls['password'].value,
            })

            this.httpError$ = req$.pipe(
                map(() => false),
                catchError(() => of(true))
            )

            this.httpErrorMessage$ = req$.pipe(
                map(() => ''),
                catchError((error) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (error?.message) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        return of(error.message as string)
                    }

                    return of(error as string)
                })
            )

            this.subs = req$.pipe(
                switchMap(({ data: { userID, accessToken, refreshToken } }) => {
                    this.sessionService.set(userID, accessToken, refreshToken)
                    return this.router.navigateByUrl('')
                }),
                catchError(() => {
                    this.loading = false
                    return of()
                })
            ).subscribe()
        }
    }

    ngOnDestroy(): void {
        if (this.subs) this.subs.unsubscribe()
    }
}
