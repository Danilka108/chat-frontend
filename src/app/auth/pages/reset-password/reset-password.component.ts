import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpService } from '../../shared/http.service'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

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
        private readonly httpService: HttpService,
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

            const req$ = this.httpService.resetPassword(this.formGroup.controls['email'].value)

            this.httpError$ = req$.pipe(
                map(() => false),
                catchError(() => of(false))
            )

            req$.subscribe(
                () => this.router.navigate(['/reset-password-check-email']),
                () => this.loading = false
            )
        }
    }
}
