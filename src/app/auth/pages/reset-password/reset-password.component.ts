import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpService } from '../../shared/http.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    formGroup!: FormGroup
    emailSent = {
        message: 'If the user is registered with this email address, the email will be sent to this email address',
        errorMessage: 'Server error. Try later',
        action: 'ok',
        duration: 100000000
    }

    constructor(
        private readonly fb: FormBuilder,
        private readonly httpService: HttpService,
        private readonly snackBar: MatSnackBar
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            email: new FormControl(null, Validators.required)
        })
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const self = this

            this.httpService.resetPassword(this.formGroup.controls.email.value)
                .subscribe({
                    next() {
                        self.snackBar.open(self.emailSent.message, self.emailSent.action, {
                            duration: self.emailSent.duration
                        })
                    },
                    error() {
                        self.snackBar.open(self.emailSent.errorMessage, self.emailSent.action, {
                            duration: self.emailSent.duration,
                            panelClass: 'error-snackbar'
                        })
                    }
                })
        }
    }
}
