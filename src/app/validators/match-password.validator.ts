import { FormGroup, ValidationErrors } from '@angular/forms'

export const matchPasswordsValidator = (pass: string, confirmPass: string) => {
    return (group: FormGroup): ValidationErrors | null => {
        const password = group.controls[pass].value
        const confirmPassword = group.controls[confirmPass].value

        if (password !== confirmPassword) {
            return { passwordsMismatch: true }
        }

        return null
    }
}
