import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { first, map, publish, refCount } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

interface IRefreshToken {
    userID: number
    refreshToken: string
    os: string
    browser: string
}

export interface IRefreshTokenResponse {
    statusCode: number
    message: string
    data: {
        userID: number
        refreshToken: string
        accessToken: string
    }
}

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private readonly httpClient: HttpClient) {}

    refreshToken(body: IRefreshToken) {
        return this.httpClient.post(`${environment.apiUrl}/auth/refresh-token`, body).pipe(
            first(),
            publish(),
            refCount(),
            map((v) => {
                return v as IRefreshTokenResponse
            })
        )
    }
}
