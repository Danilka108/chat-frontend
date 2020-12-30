import { Injectable } from '@angular/core';
import { CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService } from '../../services/local-storage.service';
import { HttpService, IRefreshTokenResponse } from '../../services/http.service'
import { AuthStoreService } from 'src/app/store/auth/auth-store.service';

@Injectable()
export class AuthGuard implements CanLoad, CanActivateChild {
    constructor(
        private readonly localStorageService: LocalStorageService,
        private readonly authStore: AuthStoreService,
        private readonly httpService: HttpService,
        private readonly deviceService: DeviceDetectorService,
    ) {}

    req$!: Observable<IRefreshTokenResponse>

    canActivateChild(_: any) {
        return this.load()
    }

    canLoad(_: any) {
        return this.load()
    }

    private load() {
        const userID = this.authStore.getUserID()
        const accessToken = this.authStore.getAccessToken()

        const localStorageUserID = this.localStorageService.getUserID()
        const localStorageRefreshToken = this.localStorageService.getRefreshToken()

        if (userID && accessToken && localStorageUserID && localStorageRefreshToken) {
            return of(false)
        } else if (localStorageUserID && localStorageRefreshToken) {
            const deviceInfo = this.deviceService.getDeviceInfo()

            return this.httpService.refreshToken({
                userID: localStorageUserID,
                refreshToken: localStorageRefreshToken,
                os: deviceInfo.os,
                browser: `${deviceInfo.browser}/${deviceInfo.browser_version}`
            }).pipe(
                map(({ data }) => {
                    this.authStore.setAccessToken(data.accessToken)
                    this.authStore.setUserID(data.userID)

                    this.localStorageService.setUserID(data.userID)
                    this.localStorageService.setRefreshToken(data.refreshToken)

                    return false
                }),
                catchError(() => {
                    return of(true)
                })
            )
        } else {
            return of(true)
        }
    }
}