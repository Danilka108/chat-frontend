import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, publish, refCount } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

@Injectable()
export class EmailSectionHttpService {
    constructor(private readonly httpClient: HttpClient) {}

    private error() {
        return (error: any) => {
            if (error?.error?.message) {
                throw new Error(error.error.message)
            } else if (error?.status == 0) {
                throw new Error('Server error. Try again')
            } else {
                throw new Error(error)
            }
        }
    }

    confirmEmail(id: string, token: string) {
        const params = new HttpParams().set('id', id).set('token', token)

        return this.httpClient.get(`${environment.apiUrl}/email/confirm-email`, { params })
    }

    resetPassword(id: string, token: string, newPassword: string) {
        const params = new HttpParams().set('id', id).set('token', token)

        return this.httpClient
            .post(
                `${environment.apiUrl}/email/reset-password`,
                {
                    newPassword,
                },
                { params }
            )
            .pipe(publish(), refCount(), catchError(this.error()))
    }
}
