import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DeviceDetectorService } from 'ngx-device-detector'
import { first, map, publish, refCount } from 'rxjs/operators'
import { environment } from 'src/environments/environment'

interface IRefreshToken {
    userID: number
    refreshToken: string
}

interface IRefreshTokenResponse {
    statusCode: number
    message: string
    data: {
        userID: number
        refreshToken: string
        accessToken: string
    }
}

@Injectable()
export class AuthHttpService {
    constructor(private readonly httpClient: HttpClient, private readonly deviceService: DeviceDetectorService) {}

    refreshToken(body: IRefreshToken) {
        const deviceInfo = this.deviceService.getDeviceInfo()

        return this.httpClient
            .post(`${environment.apiUrl}/auth/refresh-token`, {
                ...body,
                os: `${deviceInfo.os}/${deviceInfo.os_version}`,
                browser: `${deviceInfo.browser}/${deviceInfo.browser_version}`,
            })
            .pipe(
                first(),
                publish(),
                refCount(),
                map((v) => {
                    return v as IRefreshTokenResponse
                })
            )
    }
}
