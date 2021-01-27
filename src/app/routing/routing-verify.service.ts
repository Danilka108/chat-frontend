import { Injectable } from '@angular/core'
import { of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AuthHttpService } from '../auth/services/auth-http.service'
import { AuthLocalStorageService } from '../auth/services/auth-local-storage.service'
import { updateAccessToken, updateUserID } from '../store/actions/auth.actions'
import { Store } from '../store/core/store'
import { getAccessToken, getUserID } from '../store/selectors/auth.selectors'
import { IAppState } from '../store/states/app.state'

@Injectable()
export class RoutingVerifyService {
    constructor(
        private readonly store: Store<IAppState>,
        private readonly localStorageService: AuthLocalStorageService,
        private readonly httpService: AuthHttpService
    ) {}

    verify() {
        const userID = this.store.selectSnapshot(getUserID())
        const accessToken = this.store.selectSnapshot(getAccessToken())

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
                        this.store.dispatch(updateAccessToken(data.accessToken))
                        this.store.dispatch(updateUserID(data.userID))

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
