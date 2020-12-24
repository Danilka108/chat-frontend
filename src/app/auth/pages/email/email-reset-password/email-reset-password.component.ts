import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatchPasswords } from 'src/app/auth/matchers/match-passwords.matcher';
import { matchPasswordsValidator } from 'src/app/auth/validators/match-passwords.validator';

@Component({
  selector: 'app-email-reset-password',
  templateUrl: './email-reset-password.component.html',
  styleUrls: ['./email-reset-password.component.scss']
})
export class EmailResetPasswordComponent implements OnInit {

  formGroup!: FormGroup
  newPasswordHide = true
  confirmNewPasswordHide = true
  httpError = false
  httpErrorMessage = ''
  matchPasswords!: MatchPasswords

  constructor(
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.matchPasswords = new MatchPasswords()

    this.formGroup = this.fb.group({
        newPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
        confirmNewPassword: new FormControl(null, Validators.required),
      },
      { validators: matchPasswordsValidator('newPassword', 'confirmNewPassword') },
    )
  }

  onSubmit() {
    if (this.formGroup.valid) {

    }
  }

}
