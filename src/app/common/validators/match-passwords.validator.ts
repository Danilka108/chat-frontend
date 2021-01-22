import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const matchPasswordsValidator = (pass: string, confirmPass: string): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get(pass)?.value
        const confirmPassword = control.get(confirmPass)?.value

        if (password !== confirmPassword && password && confirmPassword) {
            return { passwordsMismatch: true }
        }

        return null
    }
}
