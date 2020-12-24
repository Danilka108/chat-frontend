import { FormControl, FormGroupDirective, NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

export class MatchPasswords implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!form?.hasError('passwordsMismatch') && !!form?.touched
    }
}
