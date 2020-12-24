import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpService } from '../../shared/http.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    formGroup!: FormGroup
    loading = false
    httpError = false

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
            const self = this

            this.httpService.resetPassword(this.formGroup.controls.email.value).subscribe({
                next() {
                    self.router.navigate(['/reset-password-check-email'])
                },
                error() {
                    self.loading = false
                    self.httpError = true
                },
            })
        }
    }
}
