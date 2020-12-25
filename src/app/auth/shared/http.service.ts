import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map, catchError, refCount, publish } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { IHttpSignInBody, IHttpSingInResponse } from '../interfaces/http-sign-in.interfaces'
import { IHttpSignUpBody, IHttpSignUpResponse } from '../interfaces/http-sign-up.interfaces'

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private httpClient: HttpClient) {}

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

    signIn(body: IHttpSignInBody) {
        return this.httpClient.post(`${environment.apiUrl}/auth/login`, body).pipe(
            publish(),
            refCount(),
            map((v) => {
                return v as IHttpSingInResponse
            }),
            catchError(this.error())
        )
    }

    signUp(body: IHttpSignUpBody) {
        return this.httpClient.post(`${environment.apiUrl}/user/create`, body).pipe(
            publish(),
            refCount(),
            map((v) => {
                return v as IHttpSignUpResponse
            }),
            catchError(this.error())
        )
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
        return this.httpClient.post(`${environment.apiUrl}/user/reset-password`, { email }).pipe(
            publish(),
            refCount(),
        )
    }

    emailResetPassword(id: string, token: string, newPassword: string) {
        const params = new HttpParams().set('id', id).set('token', token)

        return this.httpClient.post(
            `${environment.apiUrl}/email/reset-password`,
            {
                newPassword,
            },
            { params }
        ).pipe(
            publish(),
            refCount(),
            catchError(this.error())
        )
    }

    confirmEmail(id: string, token: string) {
        const params = new HttpParams().set('id', id).set('token', token)

        return this.httpClient.get(`${environment.apiUrl}/email/confirm-email`, { params })
    }
}
