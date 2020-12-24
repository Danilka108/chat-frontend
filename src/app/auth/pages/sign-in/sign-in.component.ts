import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DeviceDetectorService } from 'ngx-device-detector'
import { HttpService } from '../../shared/http.service'

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
    passwordHide = true
    httpError = false
    httpErrorMessage = ''
    formGroup!: FormGroup
    redirectLink = '/sign-up'
    resetPasswordLink = '/reset-password'

    constructor(
        private readonly fb: FormBuilder,
        private readonly httpService: HttpService,
        private readonly deviceService: DeviceDetectorService
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            email: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required]),
            rememberMe: new FormControl(true),
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const deviceInfo = this.deviceService.getDeviceInfo()

            const self = this

            this.httpService
                .signIn({
                    email: this.formGroup.get('email')?.value,
                    password: this.formGroup.get('password')?.value,
                    os: deviceInfo.os,
                    browser: deviceInfo.browser + '/' + deviceInfo.browser_version,
                })
                .subscribe({
                    error(errorMsg) {
                        self.httpError = true
                        self.httpErrorMessage = errorMsg
                    },
                })
        }
    }
}
