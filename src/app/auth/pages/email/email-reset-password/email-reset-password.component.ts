import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatchPasswords } from 'src/app/auth/matchers/match-passwords.matcher'
import { matchPasswordsValidator } from 'src/app/auth/validators/match-passwords.validator'
import { HttpService } from 'src/app/auth/shared/http.service'

@Component({
    selector: 'app-email-reset-password',
    templateUrl: './email-reset-password.component.html',
    styleUrls: ['./email-reset-password.component.scss'],
})
export class EmailResetPasswordComponent implements OnInit {
    formGroup!: FormGroup
    newPasswordHide = true
    confirmNewPasswordHide = true
    matchPasswords!: MatchPasswords
    httpError = false
    httpErrorMessage = ''
    linkError = false
    loading = false
    params: {
        id: string
        token: string
    } = {
        id: '',
        token: '',
    }
    passResetedLink = '/email/password-reseted'

    constructor(
        private readonly fb: FormBuilder,
        private readonly activatedRoute: ActivatedRoute,
        private readonly httpService: HttpService,
        private readonly router: Router
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((v) => {
            if (!v?.id || !v?.token) {
                this.linkError = true
            } else {
                this.params.id = v.id
                this.params.token = v.token
            }
        })

        this.matchPasswords = new MatchPasswords()

        this.formGroup = this.fb.group(
            {
                newPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
                confirmNewPassword: new FormControl(null, Validators.required),
            },
            { validators: matchPasswordsValidator('newPassword', 'confirmNewPassword') }
        )
    }

    onSubmit() {
        if (this.formGroup.valid && !this.loading && !this.linkError) {
            const self = this
            this.loading = true

            this.httpService
                .emailResetPassword(this.params.id, this.params.token, this.formGroup.controls['newPassword'].value)
                .subscribe({
                    next() {
                        self.router.navigate([self.passResetedLink])
                    },
                    error(error) {
                        self.httpError = true
                        self.httpErrorMessage = error
                        self.loading = false
                    },
                })
        }
    }
}
