import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { IHttpLogin } from '../interfaces/http-login.interface'
import { IHttpRegistration } from '../interfaces/http-registration.interface'
import { EmailConfirmEmailComponent } from '../pages/email/email-confirm-email/email-confirm-email.component'

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private httpClient: HttpClient) {}

    signIn(data: IHttpLogin) {
        return this.post(`${environment.apiUrl}/auth/login`, data)
    }

    signUp(data: IHttpRegistration) {
        return this.post(`${environment.apiUrl}/user/create`, data)
    }

    checkEmail(email: string) {
        return new Observable((observer) => {
            this.httpClient.post(`${environment.apiUrl}/user/check-email`, { email }).subscribe({
                next() {
                    observer.next()
                },
                error(error) {
                    observer.error(error.status)
                },
            })
        })
    }

    resetPassword(email: string) {
        return this.post(`${environment.apiUrl}/user/reset-password`, { email })
    }

    emailResetPassword(id: string, token: string, newPassword: string) {
        const params = new HttpParams().set('id', id).set('token', token)

        return this.post(
            `${environment.apiUrl}/email/reset-password`,
            {
                newPassword,
            },
            { params }
        )
    }

    confirmEmail(id: string, token: string) {
        const params = new HttpParams().set('id', id).set('token', token)

        return this.httpClient.get(`${environment.apiUrl}/email/confirm-email`, { params })
    }

    private post(url: string, data: object, params: object = {}) {
        return new Observable((observer) => {
            this.httpClient.post(url, data, params).subscribe({
                next() {
                    observer.next()
                },
                error(error) {
                    if (error.status === 0) {
                        observer.error('Server is not available')
                    } else if (error?.error?.message) {
                        observer.error(error.error.message as string)
                    } else {
                        observer.error(error.message)
                    }
                },
            })
        })
    }
}
