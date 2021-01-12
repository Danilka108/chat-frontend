import { Injectable } from '@angular/core'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AuthHttpService } from '../auth/services/auth-http.service'
import { AuthLocalStorageService } from '../auth/services/auth-local-storage.service'
import { AuthStore } from '../store/auth/auth.store'

@Injectable()
export class RoutingVerifyService {
    constructor(
        private readonly authStore: AuthStore,
        private readonly localStorageService: AuthLocalStorageService,
        private readonly httpService: AuthHttpService,
    ) {}
    
    verify() {
        const userID = this.authStore.getUserID()
        const accessToken = this.authStore.getAccessToken()

        const localStorageUserID = this.localStorageService.getUserID()
        const localStorageRefreshToken = this.localStorageService.getRefreshToken()

        if (userID && accessToken && localStorageUserID && localStorageRefreshToken) {
            return of(false)
        } else if (localStorageUserID && localStorageRefreshToken) {
            this.localStorageService.removeRefreshToken()
            this.localStorageService.removeUserID()

            return this.httpService
                .refreshToken({
                    userID: localStorageUserID,
                    refreshToken: localStorageRefreshToken,
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