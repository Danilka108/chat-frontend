import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from '@angular/forms'
import { HttpService } from '../shared/http.service'
import { catchError, debounceTime, last, map, take } from 'rxjs/operators'
import { Observable, of } from 'rxjs'

export const checkEmailAsyncValidator = (httpService: HttpService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<null | ValidationErrors> => {
        return httpService.checkEmail(control.value).pipe(
            take(1),
            map(() => {
                return null
            }),
            catchError(() => of({ emailInUse: true }))
        )
    }
}
