import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms'
import { AuthSectionHttpService } from '../services/auth-section-http.service'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

export const checkEmailAsyncValidator = (authHttpService: AuthSectionHttpService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<null | ValidationErrors> => {
        return authHttpService.checkEmail(control.value).pipe(
            map((result) => {
                if (result) return null
                return { emailInUse: true }
            })
        )
    }
}
