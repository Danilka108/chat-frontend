import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Observable, of } from 'rxjs'
import { map, catchError, refCount, publish } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

interface ISignIn {
    email: string,
    password: string,
}

interface ISignInResponse {
    statusCode: number
    message: string
    data: {
        userID: number
        accessToken: string
        refreshToken: string
    }
}

interface ISignUp {
    email: string,
    name: string,
    password: string,
}

interface ISignUpResponse {
    statusCode: number
    message: string
}

@Injectable()
export class AuthSectionHttpService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly deviceService: DeviceDetectorService,
    ) {}

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

    signIn(body: ISignIn) {
        const deviceInfo = this.deviceService.getDeviceInfo()

        return this.httpClient.post(`${environment.apiUrl}/auth/login`, {
            ...body,
            os: `${deviceInfo.os}/${deviceInfo.os_version}`,
            browser: deviceInfo.browser + '/' + deviceInfo.browser_version,
        }).pipe(
            publish(),
            refCount(),
            map((v) => {
                return v as ISignInResponse
            }),
            catchError(this.error())
        )
    }

    signUp(body: ISignUp) {
        const deviceInfo = this.deviceService.getDeviceInfo()

        return this.httpClient.post(`${environment.apiUrl}/user`, {
            ...body,
            os: `${deviceInfo.os}/${deviceInfo.os_version}`,
            browser: deviceInfo.browser + '/' + deviceInfo.browser_version,
        }).pipe(
            publish(),
            refCount(),
            map((v) => {
                return v as ISignUpResponse
            }),
            catchError(this.error())
        )
    }

    checkEmail(email: string) {
        return this.httpClient.post(`${environment.apiUrl}/user/check-email`, { email }).pipe(
            map(() => true),
            catchError((error) => {
                if (error?.status === 400) return of(false)
                return of(true)
            })
        )
    }

    resetPassword(email: string) {
        return this.httpClient.post(`${environment.apiUrl}/user/reset-password`, { email }).pipe(publish(), refCount())
    }
}
