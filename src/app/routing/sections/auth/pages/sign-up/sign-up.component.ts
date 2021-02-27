import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { MatchPasswords } from 'src/app/common/matchers/match-passwords.matcher'
import { matchPasswordsValidator } from 'src/app/common/validators/match-passwords.validator'
import { authSectionCompleteRegistrationPath, authSectionSignInPath } from 'src/app/routing/routing.constants'
import { AuthSectionHttpService } from '../../services/auth-section-http.service'
import { checkEmailAsyncValidator } from '../../validators/check-email-async.validator'

@Component({
    selector: 'app-auth-sign-up',
    templateUrl: './sign-up.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
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

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    loading = false

    redirectLink = authSectionSignInPath.full
    completeLink = authSectionCompleteRegistrationPath.full

    subs!: Subscription

    constructor(private readonly authHttpService: AuthSectionHttpService, private readonly router: Router) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit() {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const req$ = this.authHttpService.signUp({
                email: this.formGroup.controls['email'].value,
                name: this.formGroup.controls['name'].value,
                password: this.formGroup.controls['password'].value,
            })

            this.httpError$ = req$.pipe(
                map(() => false),
                catchError(() => of(true))
            )

            this.httpErrorMessage$ = req$.pipe(
                map(() => of('')),
                catchError((error) => {
                    if (error?.message) {
                        return of(error.message)
                    }

                    return of(error)
                })
            )

            this.subs = req$.subscribe(
                () => this.router.navigateByUrl(this.completeLink),
                () => (this.loading = false)
            )
        }
    }

    ngOnDestroy() {
        if (this.subs) this.subs.unsubscribe()
    }
}
