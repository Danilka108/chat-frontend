import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthSectionHttpService } from '../../services/auth-section-http.service'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { authResetPasswordCheckEmailPath } from 'src/app/routes.constants'

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
    formGroup = new FormGroup({
        email: new FormControl(null, Validators.required),
    })

    loading = false

    httpError$ = of(false)

    constructor(
        private readonly httpService: AuthSectionHttpService,
        private readonly router: Router
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit() {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const req$ = this.httpService.resetPassword(this.formGroup.controls['email'].value)

            this.httpError$ = req$.pipe(
                map(() => false),
                catchError(() => of(true))
            )

            req$.subscribe(
                () => this.router.navigateByUrl(authResetPasswordCheckEmailPath.full),
                () => (this.loading = false)
            )
        }
    }
}
