import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { MatchPasswords } from '../../matchers/match-passwords.matcher'
import { HttpService } from '../../shared/http.service'

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
    passwordHide = true
    formGroup!: FormGroup

    redirectLink = '/sign-up'
    resetPasswordLink = '/reset-password'

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    constructor(
        private readonly fb: FormBuilder,
        private readonly httpService: HttpService,
        private readonly deviceService: DeviceDetectorService,
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

            const req$ = this.httpService.signIn({
                email: this.formGroup.controls['email'].value,
                password: this.formGroup.controls['password'].value,
                os: deviceInfo.os,
                browser: deviceInfo.browser + '/' + deviceInfo.browser_version,
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
            
            req$.subscribe(() => {
                console.log('ok')
            })
        }
    }
}
