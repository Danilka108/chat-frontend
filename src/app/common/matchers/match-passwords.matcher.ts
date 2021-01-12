import { FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

export class MatchPasswords implements ErrorStateMatcher {
    isErrorState(_: any, form: FormGroupDirective | NgForm | null): boolean {
        return !!form?.hasError('passwordsMismatch') && !!form?.touched
    }
}