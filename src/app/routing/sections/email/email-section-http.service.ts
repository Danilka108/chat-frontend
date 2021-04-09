import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map, publish, refCount } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

@Injectable()
export class EmailSectionHttpService {
    constructor(private readonly httpClient: HttpClient) {}

    private error() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (error: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error?.error?.message) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                throw new Error(error.error.message)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            } else if (error?.status == 0) {
                throw new Error('Server error. Try again')
            } else {
                throw new Error(error)
            }
        }
    }

    confirmEmail(id: string, token: string): Observable<void> {
        const params = new HttpParams().set('id', id).set('token', token)

        return this.httpClient.get(`${environment.apiUrl}/email/confirm-email`, { params }).pipe(
            map(() => undefined)
        )
    }

    resetPassword(id: string, token: string, newPassword: string): Observable<void> {
        const params = new HttpParams().set('id', id).set('token', token)

        return this.httpClient
            .post(
                `${environment.apiUrl}/email/reset-password`,
                {
                    newPassword,
                },
                { params }
            )
            .pipe(publish(), refCount(), catchError(this.error()), map(() => undefined))
    }
}
