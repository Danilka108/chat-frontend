import { Component, OnDestroy } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { from, of, Subscription } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { MatchPasswords } from 'src/app/common/matchers/match-passwords.matcher'
import { matchPasswordsValidator } from 'src/app/common/validators/match-passwords.validator'
import { authSectionCompleteRegistrationPath, authSectionSignInPath } from 'src/app/routing/routing.constants'
import { AuthSectionHttpService } from '../../services/auth-section-http.service'
import { checkEmailAsyncValidator } from '../../validators/check-email-async.validator'

@Component({
    selector: 'app-auth-sign-up',
    templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnDestroy {
    formGroup = new FormGroup(
        {
            email: new FormControl(
                null,
                // eslint-disable-next-line @typescript-eslint/unbound-method
                [Validators.required, Validators.pattern(/@/)],
                [checkEmailAsyncValidator(this.authHttpService)]
            ),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            confirmPassword: new FormControl(null, Validators.required),
        },
        {
            validators: [matchPasswordsValidator('password', 'confirmPassword')],
        }
    )

    matchPasswords = new MatchPasswords()

    passwordHide = true
    confirmPasswordHide = true

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    loading = false

    redirectLink = authSectionSignInPath.full
    completeLink = authSectionCompleteRegistrationPath.full

    subs!: Subscription

    constructor(private readonly authHttpService: AuthSectionHttpService, private readonly router: Router) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(): void {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const req$ = this.authHttpService.signUp({
                email: this.formGroup.controls['email'].value as string,
                name: this.formGroup.controls['name'].value as string,
                password: this.formGroup.controls['password'].value as string,
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
                switchMap(() => from(this.router.navigateByUrl(this.completeLink))),
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
