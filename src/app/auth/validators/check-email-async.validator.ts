import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms'
import { AuthHttpService } from '../auth-http.service'
import { catchError, debounceTime, last, map, take } from 'rxjs/operators'
import { Observable, of } from 'rxjs'

export const checkEmailAsyncValidator = (authHttpService: AuthHttpService): AsyncValidatorFn => {
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
