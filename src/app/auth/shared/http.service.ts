import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { IHttpLogin } from '../interfaces/http-login.interface'
import { IHttpRegistration } from '../interfaces/http-registration.interface'

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
        return this.post(`${environment.apiUrl}/user/check-email`, { email })
    }

    resetPassword(email: string) {
        return this.post(`${environment.apiUrl}/user/reset-password`, { email })
    }

    private post(url: string, data: object) {
        return new Observable((observer) => {
            this.httpClient.post(url, data).subscribe({
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
