import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms'
import { AuthHttpService } from '../services/auth-http.service'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

export const checkEmailAsyncValidator = (authHttpService: AuthHttpService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<null | ValidationErrors> => {
        return authHttpService.checkEmail(control.value).pipe(
            map((result) => {
                if (result) return null
                return { emailInUse: true }
            })
        )
    }
}
