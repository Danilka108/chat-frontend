import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { authSectionResetPasswordPath, authSectionSignUpPath } from 'src/app/routing/routing.constants'
import { SessionService } from 'src/app/session/session.service'
import { AuthSectionHttpService } from '../../services/auth-section-http.service'

@Component({
    selector: 'app-auth-sing-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent implements OnDestroy {
    passwordHide = true

    formGroup = new FormGroup({
        email: new FormControl(null, [Validators.required]),
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

    onSubmit() {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const req$ = this.httpService.signIn({
                email: this.formGroup.controls['email'].value,
                password: this.formGroup.controls['password'].value,
            })

            this.httpError$ = req$.pipe(
                map(() => false),
                catchError(() => of(true))
            )

            this.httpErrorMessage$ = req$.pipe(
                map(() => ''),
                catchError((error) => {
                    if (error?.message) {
                        return of(error.message)
                    }

                    return of(error)
                })
            )

            this.subs = req$.subscribe(
                ({ data: { userID, accessToken, refreshToken } }) => {
                    this.sessionService.set(userID, accessToken, refreshToken)
                    this.router.navigateByUrl('')
                },
                () => (this.loading = false)
            )
        }
    }

    ngOnDestroy() {
        if (this.subs) this.subs.unsubscribe()
    }
}
