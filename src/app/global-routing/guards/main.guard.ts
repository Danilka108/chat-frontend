import { Injectable } from '@angular/core';
import { CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthStore } from 'src/app/auth.store';
import { LocalStorageService } from '../../services/local-storage.service';
import { HttpService } from '../../services/http.service'

@Injectable()
export class MainGuard implements CanLoad, CanActivateChild {
    constructor(
        private readonly localStorageService: LocalStorageService,
        private readonly authStore: AuthStore,
        private readonly httpService: HttpService,
        private readonly deviceService: DeviceDetectorService,
    ) {}

    canActivateChild(_: any) {
        return this.load()
    }

    canLoad(route: Route, segmets: UrlSegment[]) {
        return this.load()
    }

    private load() {
        const userID = this.authStore.getUserID()
        const accessToken = this.authStore.getAccessToken()

        const localStorageUserID = this.localStorageService.getUserID()
        const localStorageRefreshToken = this.localStorageService.getRefreshToken()

        if (userID && accessToken && localStorageUserID && localStorageRefreshToken) {
            return of(true)
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

                    return true
                }),
                catchError(() => {
                    return of(false)
                })
            )
        } else {
            return of(false)
        }
    }
}