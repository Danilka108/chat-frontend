import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthHttpService } from '../../auth-http.service'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { authResetPasswordCheckEmailPath } from 'src/app/routes.constants'

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
    formGroup!: FormGroup

    loading = false

    httpError$ = of(false)

    constructor(
        private readonly fb: FormBuilder,
        private readonly authHttpService: AuthHttpService,
        private readonly router: Router
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            email: new FormControl(null, Validators.required),
        })
    }

    onSubmit() {
        if (this.formGroup.valid && !this.loading) {
            this.loading = true

            const req$ = this.authHttpService.resetPassword(this.formGroup.controls['email'].value)

            this.httpError$ = req$.pipe(
                map(() => false),
                catchError(() => of(true))
            )

            req$.subscribe(
                () => this.router.navigate([authResetPasswordCheckEmailPath.full]),
                () => (this.loading = false)
            )
        }
    }
}
