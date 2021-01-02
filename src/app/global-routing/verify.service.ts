import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '../services/http.service';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthStoreService } from '../store/auth/auth-store.service';


@Injectable()
export class VerifyService {
    constructor(
        private readonly authStore: AuthStoreService,
        private readonly localStorageService: LocalStorageService,
        private readonly httpService: HttpService,
        private readonly deviceService: DeviceDetectorService,
    ) {}

    verify() {
        const userID = this.authStore.getUserID()
        const accessToken = this.authStore.getAccessToken()

        const localStorageUserID = this.localStorageService.getUserID()
        const localStorageRefreshToken = this.localStorageService.getRefreshToken()

        if (userID && accessToken && localStorageUserID && localStorageRefreshToken) {
            return of(false)
        } else if (localStorageUserID && localStorageRefreshToken) {
            const deviceInfo = this.deviceService.getDeviceInfo()

            this.localStorageService.removeRefreshToken()
            this.localStorageService.removeUserID()

            return this.httpService
                .refreshToken({
                    userID: localStorageUserID,
                    refreshToken: localStorageRefreshToken,
                    os: deviceInfo.os,
                    browser: `${deviceInfo.browser}/${deviceInfo.browser_version}`,
                })
                .pipe(
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