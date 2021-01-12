import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms'
import { AuthSectionHttpService } from '../services/auth-section-http.service'
import { catchError, map, take } from 'rxjs/operators'
import { Observable, of } from 'rxjs'

export const checkEmailAsyncValidator = (authHttpService: AuthSectionHttpService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<null | ValidationErrors> => {
        return authHttpService.checkEmail(control.value).pipe(
            take(1),
            map(() => {
                return null
            }),
            catchError((status) => {
                if (status == 400) {
                    return of({ emailInUse: true })
                }

                return of(null)
            })
        )
    }
}
