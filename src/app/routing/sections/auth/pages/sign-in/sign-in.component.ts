/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnDestroy } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { from, of, Subscription } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { SessionTypeService } from 'src/app/common/session-type.service'
import { authSectionResetPasswordPath, authSectionSignUpPath } from 'src/app/routing/routing.constants'
import { SessionService } from 'src/app/session/session.service'
import { AuthHttpService } from '../../services/auth-http.service'

@Component({
    selector: 'app-sing-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
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

    httpErrorMessage = ''

    loading = false

    subscription = new Subscription()

    constructor(
        private readonly httpService: AuthHttpService,
        private readonly router: Router,
        private readonly sessionService: SessionService,
        private readonly sessionTypeService: SessionTypeService
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    onSubmit(): void {
        const emailValue = this.formGroup.get('email')!.value as string | null
        const passwordValue = this.formGroup.get('password')!.value as string | null
        const rememberMe = this.formGroup.get('rememberMe')!.value as boolean

        if (this.formGroup.valid && !this.loading && emailValue !== null && passwordValue !== null) {
            this.loading = true

            this.sub = this.httpService
                .signIn({
                    email: emailValue,
                    password: passwordValue,
                })
                .pipe(
                    switchMap(({ data: { userID, accessToken, refreshToken } }) => {
                        this.httpErrorMessage = ''
                        this.sessionTypeService.setStorage(rememberMe)
                        this.sessionService.set(userID, accessToken, refreshToken)
                        return from(this.router.navigateByUrl(''))
                    }),
                    catchError((error) => {
                        if (error?.message) {
                            this.httpErrorMessage = error.message as string
                        } else {
                            this.httpErrorMessage = error as string
                        }

                        this.loading = false
                        return of()
                    })
                )
                .subscribe()
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
