import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AuthStore } from 'src/app/auth.store'
import { LocalStorageService } from 'src/app/services/local-storage.service'
import { mainPath, resetPasswordPath, signUpPath } from 'src/app/routes.constants'
import { AuthHttpService } from '../../auth-http.service'

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
    passwordHide = true
    formGroup!: FormGroup

    redirectLink = signUpPath.full
    resetPasswordLink = resetPasswordPath.full

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    constructor(
        private readonly fb: FormBuilder,
        private readonly authHttpService: AuthHttpService,
        private readonly deviceService: DeviceDetectorService,
        private readonly localStorageService: LocalStorageService,
        private readonly authStore: AuthStore,
        private readonly router: Router,
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

            const req$ = this.authHttpService.signIn({
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
            
            req$.subscribe(({ data }) => {
                this.localStorageService.setRefreshToken(data.refreshToken)
                this.localStorageService.setUserID(data.userID)

                this.authStore.setAccessToken(data.accessToken)
                this.authStore.setUserID(data.userID)

                this.router.navigateByUrl(mainPath.full)
            })
        }
    }
}
