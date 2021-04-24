/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnDestroy } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { MatchPasswords } from 'src/app/common/matchers/match-passwords.matcher'
import { matchPasswordsValidator } from 'src/app/common/validators/match-passwords.validator'
import { authSectionCompleteRegistrationPath, authSectionSignInPath } from 'src/app/routing/routing.constants'
import { AuthHttpService } from '../../services/auth-http.service'
import { checkEmailAsyncValidator } from '../../validators/check-email-async.validator'

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnDestroy {
    formGroup = new FormGroup(
        {
            email: new FormControl(
                null,
                [Validators.required, Validators.pattern(/@/)],
                [checkEmailAsyncValidator(this.authHttpService)]
            ),
            name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
            password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
            confirmPassword: new FormControl(null, Validators.required),
        },
        {
            validators: [matchPasswordsValidator('password', 'confirmPassword')],
        }
    )

    matchPasswords = new MatchPasswords()

    passwordHide = true
    confirmPasswordHide = true

    httpError = false
    httpErrorMessage = ''

    loading = false

    redirectLink = authSectionSignInPath.full
    completeLink = authSectionCompleteRegistrationPath.full

    subscription = new Subscription()

    constructor(private readonly authHttpService: AuthHttpService, private readonly router: Router) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    set sub(sub: Subscription) {
        this.subscription.add(sub)
    }

    onSubmit(): void {
        const emailValue = this.formGroup.get('email')!.value as string | null
        const passwordValue = this.formGroup.get('password')!.value as string | null
        const nameValue = this.formGroup.get('name')!.value as string | null

        if (
            this.formGroup.valid &&
            !this.loading &&
            emailValue !== null &&
            passwordValue !== null &&
            nameValue !== null
        ) {
            this.loading = true

            this.sub = this.authHttpService
                .signUp({
                    email: emailValue,
                    name: nameValue,
                    password: passwordValue,
                })
                .pipe(
                    switchMap(() => {
                        this.httpErrorMessage = ''
                        return of(this.router.navigateByUrl(this.completeLink))
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
