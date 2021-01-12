import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthLocalStorageService } from 'src/app/auth/services/auth-local-storage.service';
import { authSectionResetPasswordPath, authSectionSignUpPath } from 'src/app/routing/routing.constants';
import { AuthStore } from 'src/app/store/auth/auth.store';
import { AuthSectionHttpService } from '../../services/auth-section-http.service';

@Component({
    selector: 'app-auth-sing-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
    passwordHide = true

    formGroup = new FormGroup({
        email: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required]),
        rememberMe: new FormControl(true),
    })

    redirectLink = authSectionSignUpPath.full
    resetPasswordLink = authSectionResetPasswordPath.full

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    loading = false

    constructor(
        private readonly httpService: AuthSectionHttpService,
        private readonly localStorageService: AuthLocalStorageService,
        private readonly authStore: AuthStore,
        private readonly router: Router
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit() {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const req$ = this.httpService.signIn({
                email: this.formGroup.controls['email'].value,
                password: this.formGroup.controls['password'].value,
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

            req$.subscribe(
                ({ data }) => {
                    this.localStorageService.setRefreshToken(data.refreshToken)
                    this.localStorageService.setUserID(data.userID)

                    this.authStore.setAccessToken(data.accessToken)
                    this.authStore.setUserID(data.userID)

                    this.router.navigateByUrl('')
                },
                () => this.loading = false
            )
        }
    }
}