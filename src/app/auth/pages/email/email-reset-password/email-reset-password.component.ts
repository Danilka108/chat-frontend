import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatchPasswords } from 'src/app/auth/matchers/match-passwords.matcher'
import { matchPasswordsValidator } from 'src/app/auth/validators/match-passwords.validator'
import { AuthHttpService } from 'src/app/auth/auth-http.service'
import { of, Subscription } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { emailPasswordResetedPath } from 'src/app/routes.constants'

@Component({
    selector: 'app-email-reset-password',
    templateUrl: './email-reset-password.component.html',
    styleUrls: ['./email-reset-password.component.scss'],
})
export class EmailResetPasswordComponent implements OnInit {
    formGroup!: FormGroup
    newPasswordHide = true
    confirmNewPasswordHide = true

    matchPasswords = new MatchPasswords()

    httpError = false
    httpErrorMessage = ''

    linkError = false
    loading = false

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    params: {
        id: string
        token: string
    } = {
        id: '',
        token: '',
    }

    passResetedLink = emailPasswordResetedPath.full

    constructor(
        private readonly fb: FormBuilder,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authHttpService: AuthHttpService,
        private readonly router: Router
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((v) => {
            if (!v?.id || !v?.token) {
                this.linkError = true
            } else {
                this.params.id = v.id
                this.params.token = v.token
            }
        })

        this.formGroup = this.fb.group(
            {
                newPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
                confirmNewPassword: new FormControl(null, Validators.required),
            },
            { validators: matchPasswordsValidator('newPassword', 'confirmNewPassword') }
        )
    }

    onSubmit() {
        if (this.formGroup.valid && !this.loading && !this.linkError) {

            this.loading = true

            const req$ = this.authHttpService.emailResetPassword(
                this.params.id,
                this.params.token,
                this.formGroup.controls['newPassword'].value
            )

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

            req$.subscribe(
                () => this.router.navigate([this.passResetedLink]),
                () => this.loading = false
            )
        }
    }
}
