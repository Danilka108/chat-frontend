import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'
import { MatchPasswords } from '../../matchers/match-passwords.matcher'
import { HttpService } from '../../shared/http.service'
import { checkEmailAsyncValidator } from '../../validators/check-email-async.validator'
import { matchPasswordsValidator } from '../../validators/match-passwords.validator'

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit {
    passwordHide = true
    confirmPasswordHide = true
    formGroup!: FormGroup
    httpError = false
    httpErrorMessage = ''
    checkEmailError = false
    matchPasswords!: ErrorStateMatcher
    redirectLink = '/sign-in'
    completeLink = '/complete-registration'
    loading = false

    constructor(
        private readonly fb: FormBuilder,
        private readonly httpService: HttpService,
        private readonly deviceService: DeviceDetectorService,
        private readonly router: Router
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.matchPasswords = new MatchPasswords()

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
            const deviceInfo = this.deviceService.getDeviceInfo()
            const self = this
            this.loading = true

            this.httpService
                .signUp({
                    email: this.formGroup.controls['email'].value,
                    name: this.formGroup.controls['name'].value,
                    password: this.formGroup.controls['password'].value,
                    os: deviceInfo.os,
                    browser: deviceInfo.browser + '/' + deviceInfo.browser_version,
                })
                .subscribe({
                    next() {
                        self.router.navigate([self.completeLink])
                    },
                    error(errorMsg) {
                        self.httpError = true
                        self.httpErrorMessage = errorMsg
                        self.loading = false
                    },
                })
        }
    }
}
