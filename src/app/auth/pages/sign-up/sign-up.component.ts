import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'
import { combineLatest, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { MatchPasswords } from '../../matchers/match-passwords.matcher'
import { HttpService } from '../../shared/http.service'
import { checkEmailAsyncValidator } from '../../validators/check-email-async.validator'
import { matchPasswordsValidator } from '../../validators/match-passwords.validator'

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

    redirectLink = '/sign-in'
    completeLink = '/complete-registration'

    constructor(
        private readonly fb: FormBuilder,
        private readonly httpService: HttpService,
        private readonly deviceService: DeviceDetectorService,
        private readonly router: Router,
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group(
            {
                email: new FormControl(
                    null,
                    [Validators.required, Validators.pattern(/@/)],
                    [checkEmailAsyncValidator(this.httpService)]
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

            const req$ = this.httpService.signUp({
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
                () => this.loading = false
            )
        }
    }
}
