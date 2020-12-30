import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { MatchPasswords } from '../../../matchers/match-passwords.matcher'
import { AuthHttpService } from '../../auth-http.service'
import { checkEmailAsyncValidator } from '../../validators/check-email-async.validator'
import { matchPasswordsValidator } from 'src/app/validators/match-password.validator'
import { authCompleteRegistrationPath, authSignInPath } from 'src/app/routes.constants'

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit {
    matchPasswords = new MatchPasswords()

    passwordHide = true
    confirmPasswordHide = true
    formGroup!: FormGroup

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    loading = false

    redirectLink = authSignInPath.full
    completeLink = authCompleteRegistrationPath.full

    constructor(
        private readonly fb: FormBuilder,
        private readonly authHttpService: AuthHttpService,
        private readonly deviceService: DeviceDetectorService,
        private readonly router: Router
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group(
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
            { validators: matchPasswordsValidator('password', 'confirmPassword') }
        )
    }

    onSubmit() {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const deviceInfo = this.deviceService.getDeviceInfo()

            const req$ = this.authHttpService.signUp({
                email: this.formGroup.controls['email'].value,
                name: this.formGroup.controls['name'].value,
                password: this.formGroup.controls['password'].value,
                os: deviceInfo.os,
                browser: deviceInfo.browser + '/' + deviceInfo.browser_version,
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

            req$.subscribe(
                () => this.router.navigate([this.completeLink]),
                () => (this.loading = false)
            )
        }
    }
}
