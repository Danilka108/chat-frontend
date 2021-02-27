import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { MatchPasswords } from 'src/app/common/matchers/match-passwords.matcher'
import { matchPasswordsValidator } from 'src/app/common/validators/match-passwords.validator'
import { emailSectionPasswordResetedPath } from 'src/app/routing/routing.constants'
import { EmailSectionHttpService } from '../../email-section-http.service'
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    formGroup = new FormGroup(
        {
            newPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
            confirmNewPassword: new FormControl(null, Validators.required),
        },
        { validators: matchPasswordsValidator('newPassword', 'confirmNewPassword') }
    )

    newPasswordHide = true
    confirmNewPasswordHide = true

    matchPasswords = new MatchPasswords()

    linkError = false
    loading = false

    httpError$ = of(false)
    httpErrorMessage$ = of('')

    redirectLink = ''

    params: {
        id: string
        token: string
    } = {
        id: '',
        token: '',
    }

    passResetedLink = emailSectionPasswordResetedPath.full

    subsQuery!: Subscription
    subsReq!: Subscription

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly httpService: EmailSectionHttpService,
        private readonly router: Router
    ) {
        this.onSubmit = this.onSubmit.bind(this)
    }

    ngOnInit(): void {
        this.subsQuery = this.activatedRoute.queryParams.subscribe((v) => {
            if (!v?.id || !v?.token) {
                this.linkError = true
            } else {
                this.params.id = v.id
                this.params.token = v.token
            }
        })
    }

    onSubmit() {
        if (this.formGroup.valid && !this.loading && !this.linkError) {
            this.loading = true

            const req$ = this.httpService.resetPassword(
                this.params.id,
                this.params.token,
                this.formGroup.controls['newPassword'].value
            )

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

            this.subsReq = req$.subscribe(
                () => this.router.navigate([this.passResetedLink]),
                () => {
                    this.loading = false
                }
            )
        }
    }

    ngOnDestroy() {
        if (this.subsQuery) this.subsQuery.unsubscribe()
        if (this.subsReq) this.subsReq.unsubscribe()
    }
}
